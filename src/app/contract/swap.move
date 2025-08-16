module token_swap::my_token {
    use std::option;
    use sui::coin::{Self, Coin, TreasuryCap};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::balance::{Self, Balance};
    use sui::sui::SUI;
    use sui::object::{Self, UID};
    use sui::table::{Self, Table};
    use sui::event;

    // ======== Constants ========
    const EInsufficientBalance: u64 = 0;
    const EInvalidSwapAmount: u64 = 1;
    const EPoolEmpty: u64 = 2;
    const ESlippageTooHigh: u64 = 3;
    
    // Phí swap 0.3% (3/1000)
    const FEE_NUMERATOR: u64 = 3;
    const FEE_DENOMINATOR: u64 = 1000;

    // ======== Structs ========
    
    // Token witness pattern cho One Time Witness
    public struct MY_TOKEN has drop {}

    // Liquidity Pool để swap
    public struct LiquidityPool has key {
        id: UID,
        sui_reserve: Balance<SUI>,
        token_reserve: Balance<MY_TOKEN>,
        lp_supply: u64,
        // Bảng theo dõi LP tokens của mỗi user
        lp_balances: Table<address, u64>
    }

    // Admin capability
    public struct AdminCap has key {
        id: UID
    }

    // ======== Events ========
    
    public struct TokenMinted has copy, drop {
        recipient: address,
        amount: u64
    }

    public struct SwapExecuted has copy, drop {
        sender: address,
        sui_in: u64,
        token_in: u64,
        sui_out: u64,
        token_out: u64
    }

    public struct LiquidityAdded has copy, drop {
        provider: address,
        sui_amount: u64,
        token_amount: u64,
        lp_minted: u64
    }

    public struct LiquidityRemoved has copy, drop {
        provider: address,
        sui_amount: u64,
        token_amount: u64,
        lp_burned: u64
    }

    // ======== Init Function ========
    
    fun init(witness: MY_TOKEN, ctx: &mut TxContext) {
        // Tạo currency với witness pattern
        let (treasury, metadata) = coin::create_currency(
            witness,
            9, // decimals
            b"MYT", // symbol
            b"My Token", // name
            b"A custom token for swapping with SUI", // description
            option::none(), // icon url
            ctx
        );

        // Freeze metadata để không thể thay đổi
        transfer::public_freeze_object(metadata);

        // Transfer treasury cap cho sender
        transfer::public_transfer(treasury, tx_context::sender(ctx));

        // Tạo liquidity pool rỗng
        let pool = LiquidityPool {
            id: object::new(ctx),
            sui_reserve: balance::zero<SUI>(),
            token_reserve: balance::zero<MY_TOKEN>(),
            lp_supply: 0,
            lp_balances: table::new(ctx)
        };
        transfer::share_object(pool);

        // Tạo admin capability
        let admin = AdminCap {
            id: object::new(ctx)
        };
        transfer::transfer(admin, tx_context::sender(ctx));
    }

    // ======== Mint Functions ========
    
    // Mint token mới (chỉ treasury cap holder)
    public entry fun mint(
        treasury: &mut TreasuryCap<MY_TOKEN>,
        amount: u64,
        recipient: address,
        ctx: &mut TxContext
    ) {
        let minted_coin = coin::mint(treasury, amount, ctx);
        transfer::public_transfer(minted_coin, recipient);
        
        event::emit(TokenMinted {
            recipient,
            amount
        });
    }

    // Mint và thêm vào pool
    public entry fun mint_to_pool(
        treasury: &mut TreasuryCap<MY_TOKEN>,
        pool: &mut LiquidityPool,
        amount: u64,
        ctx: &mut TxContext
    ) {
        let minted_coin = coin::mint(treasury, amount, ctx);
        let minted_balance = coin::into_balance(minted_coin);
        balance::join(&mut pool.token_reserve, minted_balance);
    }

    // ======== Liquidity Functions ========
    
    // Thêm liquidity vào pool
    public entry fun add_liquidity(
        pool: &mut LiquidityPool,
        sui_coin: Coin<SUI>,
        token_coin: Coin<MY_TOKEN>,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let sui_amount = coin::value(&sui_coin);
        let token_amount = coin::value(&token_coin);
        
        assert!(sui_amount > 0 && token_amount > 0, EInvalidSwapAmount);

        let sui_balance = coin::into_balance(sui_coin);
        let token_balance = coin::into_balance(token_coin);

        let lp_minted;
        
        if (pool.lp_supply == 0) {
            // Pool mới, LP tokens = sqrt(sui * token)
            lp_minted = sqrt(sui_amount * token_amount);
        } else {
            // Tính LP tokens dựa trên tỷ lệ hiện tại
            let sui_reserve = balance::value(&pool.sui_reserve);
            let token_reserve = balance::value(&pool.token_reserve);
            
            let lp_from_sui = (sui_amount * pool.lp_supply) / sui_reserve;
            let lp_from_token = (token_amount * pool.lp_supply) / token_reserve;
            
            // Lấy giá trị nhỏ hơn để đảm bảo tỷ lệ
            lp_minted = if (lp_from_sui < lp_from_token) {
                lp_from_sui
            } else {
                lp_from_token
            };
        };

        // Cập nhật reserves
        balance::join(&mut pool.sui_reserve, sui_balance);
        balance::join(&mut pool.token_reserve, token_balance);
        
        // Cập nhật LP supply và balance của user
        pool.lp_supply = pool.lp_supply + lp_minted;
        
        if (table::contains(&pool.lp_balances, sender)) {
            let user_balance = table::borrow_mut(&mut pool.lp_balances, sender);
            *user_balance = *user_balance + lp_minted;
        } else {
            table::add(&mut pool.lp_balances, sender, lp_minted);
        };

        event::emit(LiquidityAdded {
            provider: sender,
            sui_amount,
            token_amount,
            lp_minted
        });
    }

    // Remove liquidity từ pool
    public entry fun remove_liquidity(
        pool: &mut LiquidityPool,
        lp_amount: u64,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        assert!(table::contains(&pool.lp_balances, sender), EInsufficientBalance);
        let user_balance = table::borrow_mut(&mut pool.lp_balances, sender);
        assert!(*user_balance >= lp_amount, EInsufficientBalance);
        
        let sui_reserve = balance::value(&pool.sui_reserve);
        let token_reserve = balance::value(&pool.token_reserve);
        
        // Tính toán số SUI và token trả về
        let sui_amount = (lp_amount * sui_reserve) / pool.lp_supply;
        let token_amount = (lp_amount * token_reserve) / pool.lp_supply;
        
        assert!(sui_amount > 0 && token_amount > 0, EPoolEmpty);
        
        // Cập nhật LP balance
        *user_balance = *user_balance - lp_amount;
        pool.lp_supply = pool.lp_supply - lp_amount;
        
        // Rút SUI và token từ pool
        let sui_balance = balance::split(&mut pool.sui_reserve, sui_amount);
        let token_balance = balance::split(&mut pool.token_reserve, token_amount);
        
        // Chuyển cho user
        let sui_coin = coin::from_balance(sui_balance, ctx);
        let token_coin = coin::from_balance(token_balance, ctx);
        
        transfer::public_transfer(sui_coin, sender);
        transfer::public_transfer(token_coin, sender);
        
        event::emit(LiquidityRemoved {
            provider: sender,
            sui_amount,
            token_amount,
            lp_burned: lp_amount
        });
    }

    // ======== Swap Functions ========
    
    // Swap SUI lấy Token
    public entry fun swap_sui_for_token(
        pool: &mut LiquidityPool,
        sui_coin: Coin<SUI>,
        min_token_out: u64,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let sui_amount = coin::value(&sui_coin);
        assert!(sui_amount > 0, EInvalidSwapAmount);
        
        let sui_reserve = balance::value(&pool.sui_reserve);
        let token_reserve = balance::value(&pool.token_reserve);
        assert!(token_reserve > 0, EPoolEmpty);
        
        // Tính token output với phí
        let sui_amount_with_fee = sui_amount * (FEE_DENOMINATOR - FEE_NUMERATOR);
        let numerator = sui_amount_with_fee * token_reserve;
        let denominator = (sui_reserve * FEE_DENOMINATOR) + sui_amount_with_fee;
        let token_output = numerator / denominator;
        
        assert!(token_output >= min_token_out, ESlippageTooHigh);
        
        // Thêm SUI vào pool
        let sui_balance = coin::into_balance(sui_coin);
        balance::join(&mut pool.sui_reserve, sui_balance);
        
        // Lấy token từ pool
        let token_balance = balance::split(&mut pool.token_reserve, token_output);
        let token_coin = coin::from_balance(token_balance, ctx);
        
        transfer::public_transfer(token_coin, sender);
        
        event::emit(SwapExecuted {
            sender,
            sui_in: sui_amount,
            token_in: 0,
            sui_out: 0,
            token_out: token_output
        });
    }
    
    // Swap Token lấy SUI
    public entry fun swap_token_for_sui(
        pool: &mut LiquidityPool,
        token_coin: Coin<MY_TOKEN>,
        min_sui_out: u64,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let token_amount = coin::value(&token_coin);
        assert!(token_amount > 0, EInvalidSwapAmount);
        
        let sui_reserve = balance::value(&pool.sui_reserve);
        let token_reserve = balance::value(&pool.token_reserve);
        assert!(sui_reserve > 0, EPoolEmpty);
        
        // Tính SUI output với phí
        let token_amount_with_fee = token_amount * (FEE_DENOMINATOR - FEE_NUMERATOR);
        let numerator = token_amount_with_fee * sui_reserve;
        let denominator = (token_reserve * FEE_DENOMINATOR) + token_amount_with_fee;
        let sui_output = numerator / denominator;
        
        assert!(sui_output >= min_sui_out, ESlippageTooHigh);
        
        // Thêm token vào pool
        let token_balance = coin::into_balance(token_coin);
        balance::join(&mut pool.token_reserve, token_balance);
        
        // Lấy SUI từ pool
        let sui_balance = balance::split(&mut pool.sui_reserve, sui_output);
        let sui_coin = coin::from_balance(sui_balance, ctx);
        
        transfer::public_transfer(sui_coin, sender);
        
        event::emit(SwapExecuted {
            sender,
            sui_in: 0,
            token_in: token_amount,
            sui_out: sui_output,
            token_out: 0
        });
    }

    // ======== View Functions ========
    
    // Lấy thông tin reserves của pool
    public fun get_reserves(pool: &LiquidityPool): (u64, u64) {
        (
            balance::value(&pool.sui_reserve),
            balance::value(&pool.token_reserve)
        )
    }
    
    // Lấy LP balance của user
    public fun get_lp_balance(pool: &LiquidityPool, user: address): u64 {
        if (table::contains(&pool.lp_balances, user)) {
            *table::borrow(&pool.lp_balances, user)
        } else {
            0
        }
    }
    
    // Tính toán output amount cho swap
    public fun calculate_swap_output(
        input_amount: u64,
        input_reserve: u64,
        output_reserve: u64
    ): u64 {
        let input_amount_with_fee = input_amount * (FEE_DENOMINATOR - FEE_NUMERATOR);
        let numerator = input_amount_with_fee * output_reserve;
        let denominator = (input_reserve * FEE_DENOMINATOR) + input_amount_with_fee;
        numerator / denominator
    }

    // ======== Helper Functions ========
    
    // Tính căn bậc 2 (Babylonian method)
    fun sqrt(x: u64): u64 {
        if (x == 0) return 0;
        if (x <= 3) return 1;
        
        let mut z = x;
        let mut y = x / 2 + 1;
        
        while (y < z) {
            z = y;
            y = (x / y + y) / 2;
        };
        
        z
    }
}