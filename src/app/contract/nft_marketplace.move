module nft_marketplace::simple_nft {
    use sui::url::{Self, Url};
    use sui::object::{Self, ID, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::object_table::{Self, ObjectTable};
    use sui::event;
    use std::string::{Self, String};
    use std::vector;

    // ====== Constants ======
    const EInsufficientPayment: u64 = 0;
    const ENotOwner: u64 = 1;
    const EAlreadyListed: u64 = 2;
    const ENotListed: u64 = 3;

    // ====== Structs ======
    
    /// NFT struct - đại diện cho một NFT
    public struct NFT has key, store {
        id: UID,
        name: String,
        description: String,
        image_url: Url,
        creator: address,
    }

    /// Marketplace - shared object để quản lý mua bán
    public struct Marketplace has key {
        id: UID,
        listings: ObjectTable<ID, Listing>,
        // THÊM: Lưu trữ NFTs được list
        listed_nfts: ObjectTable<ID, NFT>,
        fee_percentage: u64, // Phí marketplace (ví dụ: 2 = 2%)
        owner: address,
    }

    /// Listing - thông tin NFT được list để bán
    public struct Listing has key, store {
        id: UID,
        nft_id: ID,
        seller: address,
        price: u64,
    }

    /// Admin capability để quản lý marketplace
    public struct AdminCap has key {
        id: UID,
    }

    // ====== Events ======
    
    public struct NFTMinted has copy, drop {
        nft_id: ID,
        creator: address,
        name: String,
    }

    public struct NFTListed has copy, drop {
        nft_id: ID,
        seller: address,
        price: u64,
    }

    public struct NFTPurchased has copy, drop {
        nft_id: ID,
        buyer: address,
        seller: address,
        price: u64,
    }

    public struct NFTDelisted has copy, drop {
        nft_id: ID,
        seller: address,
    }

    // ====== Init Function ======
    
    /// Khởi tạo marketplace khi deploy module
    fun init(ctx: &mut TxContext) {
        // Tạo marketplace shared object
        let marketplace = Marketplace {
            id: object::new(ctx),
            listings: object_table::new(ctx),
            listed_nfts: object_table::new(ctx), // THÊM
            fee_percentage: 2, // 2% phí
            owner: tx_context::sender(ctx),
        };
        
        // Share marketplace để mọi người có thể truy cập
        transfer::share_object(marketplace);
        
        // Tạo admin capability cho deployer
        let admin_cap = AdminCap {
            id: object::new(ctx),
        };
        transfer::transfer(admin_cap, tx_context::sender(ctx));
    }

    // ====== Public Functions ======
    
    /// Tạo NFT mới
    public fun mint_nft(
        name: vector<u8>,
        description: vector<u8>,
        image_url: vector<u8>,
        ctx: &mut TxContext
    ): NFT {
        let sender = tx_context::sender(ctx);
        let nft = NFT {
            id: object::new(ctx),
            name: string::utf8(name),
            description: string::utf8(description),
            image_url: url::new_unsafe_from_bytes(image_url),
            creator: sender,
        };
        
        // Emit event
        event::emit(NFTMinted {
            nft_id: object::id(&nft),
            creator: sender,
            name: nft.name,
        });
        
        nft
    }

    /// Tạo và transfer NFT cho người tạo
    public entry fun mint_and_transfer(
        name: vector<u8>,
        description: vector<u8>,
        image_url: vector<u8>,
        ctx: &mut TxContext
    ) {
        let nft = mint_nft(name, description, image_url, ctx);
        transfer::public_transfer(nft, tx_context::sender(ctx));
    }

    /// List NFT để bán trên marketplace
    public entry fun list_nft(
        marketplace: &mut Marketplace,
        nft: NFT,
        price: u64,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let nft_id = object::id(&nft);
        
        // Kiểm tra NFT chưa được list
        assert!(!object_table::contains(&marketplace.listings, nft_id), EAlreadyListed);
        
        // Tạo listing
        let listing = Listing {
            id: object::new(ctx),
            nft_id,
            seller: sender,
            price,
        };
        
        // Thêm vào marketplace
        object_table::add(&mut marketplace.listings, nft_id, listing);
        
        // SỬARFIX: Lưu NFT trong marketplace thay vì transfer đi
        object_table::add(&mut marketplace.listed_nfts, nft_id, nft);
        
        // Emit event
        event::emit(NFTListed {
            nft_id,
            seller: sender,
            price,
        });
    }

    /// Mua NFT từ marketplace - FIXED VERSION
    public entry fun buy_nft(
        marketplace: &mut Marketplace,
        nft_id: ID,
        mut payment: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        // Kiểm tra NFT có tồn tại trong marketplace
        assert!(object_table::contains(&marketplace.listings, nft_id), ENotListed);
        assert!(object_table::contains(&marketplace.listed_nfts, nft_id), ENotListed);
        
        // Lấy thông tin listing
        let listing = object_table::remove(&mut marketplace.listings, nft_id);
        let Listing { id, nft_id: _, seller, price } = listing;
        object::delete(id);
        
        // SỬA: Lấy NFT ra từ marketplace
        let nft = object_table::remove(&mut marketplace.listed_nfts, nft_id);
        
        // Kiểm tra payment đủ
        assert!(coin::value(&payment) >= price, EInsufficientPayment);
        
        // Tính phí marketplace
        let fee_amount = (price * marketplace.fee_percentage) / 100;
        let seller_amount = price - fee_amount;
        
        // Chia payment
        if (fee_amount > 0) {
            let fee_coin = coin::split(&mut payment, fee_amount, ctx);
            transfer::public_transfer(fee_coin, marketplace.owner);
        };
        
        // Chuyển tiền cho seller
        let seller_coin = coin::split(&mut payment, seller_amount, ctx);
        transfer::public_transfer(seller_coin, seller);
        
        // Trả lại tiền thừa nếu có
        if (coin::value(&payment) > 0) {
            transfer::public_transfer(payment, tx_context::sender(ctx));
        } else {
            coin::destroy_zero(payment);
        };
        
        // SỬA: Transfer NFT cho buyer
        let buyer = tx_context::sender(ctx);
        transfer::public_transfer(nft, buyer);
        
        // Emit event
        event::emit(NFTPurchased {
            nft_id,
            buyer,
            seller,
            price,
        });
    }

    /// Hủy listing NFT - FIXED VERSION
    public entry fun delist_nft(
        marketplace: &mut Marketplace,
        nft_id: ID,
        ctx: &mut TxContext
    ) {
        assert!(object_table::contains(&marketplace.listings, nft_id), ENotListed);
        
        let listing = object_table::borrow(&marketplace.listings, nft_id);
        let sender = tx_context::sender(ctx);
        
        // Kiểm tra người gọi là seller
        assert!(listing.seller == sender, ENotOwner);
        
        // Remove listing
        let Listing { id, nft_id: _, seller, price: _ } = object_table::remove(&mut marketplace.listings, nft_id);
        object::delete(id);
        
        // SỬA: Lấy NFT từ marketplace và transfer về cho seller
        let nft = object_table::remove(&mut marketplace.listed_nfts, nft_id);
        transfer::public_transfer(nft, seller);
        
        // Emit event
        event::emit(NFTDelisted {
            nft_id,
            seller,
        });
    }

    /// Update giá NFT đang list
    public entry fun update_price(
        marketplace: &mut Marketplace,
        nft_id: ID,
        new_price: u64,
        ctx: &mut TxContext
    ) {
        let listing = object_table::borrow_mut(&mut marketplace.listings, nft_id);
        let sender = tx_context::sender(ctx);
        
        // Kiểm tra người gọi là seller
        assert!(listing.seller == sender, ENotOwner);
        
        // Update price
        listing.price = new_price;
    }

    // ====== View Functions ======
    
    /// Lấy thông tin NFT
    public fun get_nft_info(nft: &NFT): (String, String, Url, address) {
        (nft.name, nft.description, nft.image_url, nft.creator)
    }

    /// Lấy thông tin listing
    public fun get_listing_info(marketplace: &Marketplace, nft_id: ID): (address, u64) {
        let listing = object_table::borrow(&marketplace.listings, nft_id);
        (listing.seller, listing.price)
    }

    /// Kiểm tra NFT có đang được list không
    public fun is_listed(marketplace: &Marketplace, nft_id: ID): bool {
        object_table::contains(&marketplace.listings, nft_id)
    }

    /// THÊM: Lấy thông tin NFT đang được list
    public fun get_listed_nft_info(marketplace: &Marketplace, nft_id: ID): (String, String, Url, address) {
        assert!(object_table::contains(&marketplace.listed_nfts, nft_id), ENotListed);
        let nft = object_table::borrow(&marketplace.listed_nfts, nft_id);
        get_nft_info(nft)
    }

    /// Lấy thông tin đầy đủ của NFT đang được list (bao gồm giá và seller)
    public fun get_full_listing_info(marketplace: &Marketplace, nft_id: ID): (String, String, Url, address, address, u64) {
        assert!(object_table::contains(&marketplace.listed_nfts, nft_id), ENotListed);
        assert!(object_table::contains(&marketplace.listings, nft_id), ENotListed);
        
        let nft = object_table::borrow(&marketplace.listed_nfts, nft_id);
        let listing = object_table::borrow(&marketplace.listings, nft_id);
        
        (nft.name, nft.description, nft.image_url, nft.creator, listing.seller, listing.price)
    }

    /// Lấy số lượng NFT đang được list
    public fun get_listings_count(marketplace: &Marketplace): u64 {
        object_table::length(&marketplace.listings)
    }

    /// Kiểm tra NFT có thuộc về seller cụ thể không
    public fun is_nft_owned_by_seller(marketplace: &Marketplace, nft_id: ID, seller: address): bool {
        if (!object_table::contains(&marketplace.listings, nft_id)) {
            return false
        };
        let listing = object_table::borrow(&marketplace.listings, nft_id);
        listing.seller == seller
    }

    /// Lấy giá của NFT đang được list
    public fun get_nft_price(marketplace: &Marketplace, nft_id: ID): u64 {
        assert!(object_table::contains(&marketplace.listings, nft_id), ENotListed);
        let listing = object_table::borrow(&marketplace.listings, nft_id);
        listing.price
    }

    /// Lấy thông tin marketplace (owner và fee)
    public fun get_marketplace_info(marketplace: &Marketplace): (address, u64) {
        (marketplace.owner, marketplace.fee_percentage)
    }

    // ====== Admin Functions ======
    
    /// Update phí marketplace (chỉ admin)
    public entry fun update_fee(
        _admin_cap: &AdminCap,
        marketplace: &mut Marketplace,
        new_fee: u64,
    ) {
        marketplace.fee_percentage = new_fee;
    }

    /// Transfer quyền admin
    public entry fun transfer_admin(
        admin_cap: AdminCap,
        new_admin: address,
    ) {
        transfer::transfer(admin_cap, new_admin);
    }

    // ====== Entry View Functions ======
    
    /// Entry function: Hiển thị thông tin NFT đang được list
    public entry fun show_listing_info(
        marketplace: &Marketplace,
        nft_id: ID,
    ) {
        if (!object_table::contains(&marketplace.listings, nft_id)) {
            // NFT không được list
            return
        };
        
        let (name, description, image_url, creator, seller, price) = get_full_listing_info(marketplace, nft_id);
        
        // Emit event để hiển thị thông tin
        event::emit(ListingInfo {
            nft_id,
            name,
            description,
            image_url,
            creator,
            seller,
            price,
        });
    }

    /// Entry function: Hiển thị tất cả listings của một seller
    public entry fun show_seller_listings(
        marketplace: &Marketplace,
        seller: address,
    ) {
        // Note: Trong thực tế cần iterate qua tất cả listings
        // Đây là version đơn giản, trong production nên có pagination
        event::emit(SellerListingsRequest {
            seller,
            total_listings: get_listings_count(marketplace),
        });
    }

    /// Entry function: Hiển thị thống kê marketplace
    public entry fun show_marketplace_stats(marketplace: &Marketplace) {
        let (owner, fee) = get_marketplace_info(marketplace);
        event::emit(MarketplaceStats {
            owner,
            fee_percentage: fee,
            total_listings: get_listings_count(marketplace),
        });
    }

    /// Entry function: Tìm NFT trong khoảng giá
    public entry fun search_nfts_by_price_range(
        marketplace: &Marketplace,
        min_price: u64,
        max_price: u64,
    ) {
        event::emit(PriceRangeSearch {
            min_price,
            max_price,
            total_listings: get_listings_count(marketplace),
        });
    }

    /// Kiểm tra NFT có trong khoảng giá không
    public fun is_nft_in_price_range(marketplace: &Marketplace, nft_id: ID, min_price: u64, max_price: u64): bool {
        if (!object_table::contains(&marketplace.listings, nft_id)) {
            return false
        };
        let price = get_nft_price(marketplace, nft_id);
        price >= min_price && price <= max_price
    }

    // ====== Additional Events ======
    
    public struct ListingInfo has copy, drop {
        nft_id: ID,
        name: String,
        description: String,
        image_url: Url,
        creator: address,
        seller: address,
        price: u64,
    }

    public struct SellerListingsRequest has copy, drop {
        seller: address,
        total_listings: u64,
    }

    public struct MarketplaceStats has copy, drop {
        owner: address,
        fee_percentage: u64,
        total_listings: u64,
    }

    public struct PriceRangeSearch has copy, drop {
        min_price: u64,
        max_price: u64,
        total_listings: u64,
    }

    // ====== Helper Functions ======
    
    /// Batch mint nhiều NFTs
    public entry fun batch_mint(
        names: vector<vector<u8>>,
        descriptions: vector<vector<u8>>,
        image_urls: vector<vector<u8>>,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let mut i = 0;
        let len = vector::length(&names);
        
        while (i < len) {
            let name = *vector::borrow(&names, i);
            let description = *vector::borrow(&descriptions, i);
            let image_url = *vector::borrow(&image_urls, i);
            
            let nft = mint_nft(name, description, image_url, ctx);
            transfer::public_transfer(nft, sender);
            
            i = i + 1;
        };
    }

    /// Transfer NFT cho người khác
    #[allow(lint(custom_state_change))]
    public entry fun transfer_nft(
        nft: NFT,
        recipient: address,
    ) {
        transfer::public_transfer(nft, recipient);
    }

    /// Burn NFT (hủy vĩnh viễn)
    public entry fun burn_nft(nft: NFT) {
        let NFT { id, name: _, description: _, image_url: _, creator: _ } = nft;
        object::delete(id);
    }

    // ====== Test Functions (chỉ dùng cho testing) ======
    
    #[test_only]
    public fun init_for_testing(ctx: &mut TxContext) {
        init(ctx);
    }

    #[test_only]
    public fun get_marketplace_owner(marketplace: &Marketplace): address {
        marketplace.owner
    }
}