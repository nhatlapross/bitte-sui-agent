Created Objects:                                                                                                                │
│  ┌──                                                                                                                            │
│  │ ObjectID: 0x1b14ae4bd8fbf6e9743547e19586716638987adafe8c25a2fd8445ef44c8d613                                                 │
│  │ Sender: 0xe5742b83435093dfa37fc9c49ca32421572eb71fcaa303340138e4fd66884914                                                   │
│  │ Owner: Account Address ( 0xe5742b83435093dfa37fc9c49ca32421572eb71fcaa303340138e4fd66884914 )                                │
│  │ ObjectType: 0x2::coin::TreasuryCap<0x606f93905a07b1fbe1c95fa1349ec08605a6ac10f6724ad7593545e3b567a4d2::my_token::MY_TOKEN>   │
│  │ Version: 506700980                                                                                                           │
│  │ Digest: 2g1sfVZqx941F7cmTkRkijte1nTA6iA4MeohSpcTodxH                                                                         │
│  └──                                                                                                                            │
│  ┌──                                                                                                                            │
│  │ ObjectID: 0x58e02fe7f9ab3d02ab24f6c4b2d6432808fa30d0e552985033561021e2dc6e31                                                 │
│  │ Sender: 0xe5742b83435093dfa37fc9c49ca32421572eb71fcaa303340138e4fd66884914                                                   │
│  │ Owner: Shared( 506700980 )                                                                                                   │
│  │ ObjectType: 0x606f93905a07b1fbe1c95fa1349ec08605a6ac10f6724ad7593545e3b567a4d2::my_token::LiquidityPool                      │
│  │ Version: 506700980                                                                                                           │
│  │ Digest: Ae821jUtSjDqAD78GuDcujc4mqSUvrFisF7n1nCGFBj6                                                                         │
│  └──                                                                                                                            │
│  ┌──                                                                                                                            │
│  │ ObjectID: 0x6733c99b865b022ac9fa1300cb58dd84a67337c5a7512b67c647338ac8623e21                                                 │
│  │ Sender: 0xe5742b83435093dfa37fc9c49ca32421572eb71fcaa303340138e4fd66884914                                                   │
│  │ Owner: Account Address ( 0xe5742b83435093dfa37fc9c49ca32421572eb71fcaa303340138e4fd66884914 )                                │
│  │ ObjectType: 0x2::package::UpgradeCap                                                                                         │
│  │ Version: 506700980                                                                                                           │
│  │ Digest: Fb58rHqCAg3ZWaui9wmjBw32EwP5RN1PSNbSnHzv8BLe                                                                         │
│  └──                                                                                                                            │
│  ┌──                                                                                                                            │
│  │ ObjectID: 0x8a761a979f6132fa4176b9162b06d805331a65da991a859559b94c28bd23c557                                                 │
│  │ Sender: 0xe5742b83435093dfa37fc9c49ca32421572eb71fcaa303340138e4fd66884914                                                   │
│  │ Owner: Immutable                                                                                                             │
│  │ ObjectType: 0x2::coin::CoinMetadata<0x606f93905a07b1fbe1c95fa1349ec08605a6ac10f6724ad7593545e3b567a4d2::my_token::MY_TOKEN>  │
│  │ Version: 506700980                                                                                                           │
│  │ Digest: CYFpnWBACyqULx6jBXNxNzE3otp1q2HsMbKKBU2cXkA2                                                                         │
│  └──                                                                                                                            │
│  ┌──                                                                                                                            │
│  │ ObjectID: 0xb6716fca2969cc7a1ff1de86a99206812f10b7634cfaf692e146f1e2765146b1                                                 │
│  │ Sender: 0xe5742b83435093dfa37fc9c49ca32421572eb71fcaa303340138e4fd66884914                                                   │
│  │ Owner: Account Address ( 0xe5742b83435093dfa37fc9c49ca32421572eb71fcaa303340138e4fd66884914 )                                │
│  │ ObjectType: 0x606f93905a07b1fbe1c95fa1349ec08605a6ac10f6724ad7593545e3b567a4d2::my_token::AdminCap                           │
│  │ Version: 506700980                                                                                                           │
│  │ Digest: 5eYKXpE4FMLHo6Y3beT9ASjWngqqt76hAbVLz4Nfn2Bh                                                                         │
│  └──                                                                                                                            │
│ Mutated Objects:                                                                                                                │
│  ┌──                                                                                                                            │
│  │ ObjectID: 0xa90ef9a52185bbc2748dab95cefed1ac8d77cdb34a7b046da536de6e7dcea5ee                                                 │
│  │ Sender: 0xe5742b83435093dfa37fc9c49ca32421572eb71fcaa303340138e4fd66884914                                                   │
│  │ Owner: Account Address ( 0xe5742b83435093dfa37fc9c49ca32421572eb71fcaa303340138e4fd66884914 )                                │
│  │ ObjectType: 0x2::coin::Coin<0x2::sui::SUI>                                                                                   │
│  │ Version: 506700980                                                                                                           │
│  │ Digest: 69pHCZzoUwpfK3V1YALWZDVBFXExixkbYcTd7XNBVvCH                                                                         │
│  └──                                                                                                                            │
│ Published Objects:                                                                                                              │
│  ┌──                                                                                                                            │
│  │ PackageID: 0x606f93905a07b1fbe1c95fa1349ec08605a6ac10f6724ad7593545e3b567a4d2                                                │
│  │ Version: 1                                                                                                                   │
│  │ Digest: BbVVEGn7qMUNcJRNtuCEAEFkHUrtMsikKiA5KBXJcoJn                                                                         │
│  │ Modules: my_token      


----------------------
sui client call \
--package 0x606f93905a07b1fbe1c95fa1349ec08605a6ac10f6724ad7593545e3b567a4d2 \
--module my_token \
--function mint \
--args 0x1b14ae4bd8fbf6e9743547e19586716638987adafe8c25a2fd8445ef44c8d613 1000000 0xe5742b83435093dfa37fc9c49ca32421572eb71fcaa303340138e4fd66884914 \
--gas-budget 10000000

│ Object Changes                                                                                                                 │
├────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Created Objects:                                                                                                               │
│  ┌──                                                                                                                           │
│  │ ObjectID: 0x3568e0f74d92175b985a9a7450c073d38997dec66a9eb1900f2fddec0b86edd6                                                │
│  │ Sender: 0xe5742b83435093dfa37fc9c49ca32421572eb71fcaa303340138e4fd66884914                                                  │
│  │ Owner: Account Address ( 0xe5742b83435093dfa37fc9c49ca32421572eb71fcaa303340138e4fd66884914 )                               │
│  │ ObjectType: 0x2::coin::Coin<0x606f93905a07b1fbe1c95fa1349ec08605a6ac10f6724ad7593545e3b567a4d2::my_token::MY_TOKEN>         │
│  │ Version: 528531415                                                                                                          │
│  │ Digest: 6uGfNJS64BkXZu8TXMGEKpWxex8FSTnuTuWxjy6xT16j                                                                        │
│  └──                                                                                                                           │
│ Mutated Objects:                                                                                                               │
│  ┌──                                                                                                                           │
│  │ ObjectID: 0x1b14ae4bd8fbf6e9743547e19586716638987adafe8c25a2fd8445ef44c8d613                                                │
│  │ Sender: 0xe5742b83435093dfa37fc9c49ca32421572eb71fcaa303340138e4fd66884914                                                  │
│  │ Owner: Account Address ( 0xe5742b83435093dfa37fc9c49ca32421572eb71fcaa303340138e4fd66884914 )                               │
│  │ ObjectType: 0x2::coin::TreasuryCap<0x606f93905a07b1fbe1c95fa1349ec08605a6ac10f6724ad7593545e3b567a4d2::my_token::MY_TOKEN>  │
│  │ Version: 528531415                                                                                                          │
│  │ Digest: H55Pq52P4iJA4EVNU4ubaVtx6M4oU6A5ASSAYekD5FPc                                                                        │
│  └──                                                                                                                           │
│  ┌──                                                                                                                           │
│  │ ObjectID: 0x9153a82c41523939002eb8ee614d196dd90187f831839a089bba125bec16dae9                                                │
│  │ Sender: 0xe5742b83435093dfa37fc9c49ca32421572eb71fcaa303340138e4fd66884914                                                  │
│  │ Owner: Account Address ( 0xe5742b83435093dfa37fc9c49ca32421572eb71fcaa303340138e4fd66884914 )                               │
│  │ ObjectType: 0x2::coin::Coin<0x2::sui::SUI>                                                                                  │
│  │ Version: 528531415                                                                                                          │
│  │ Digest: ABzsrgHcWKHMSfEhYeLSB4vaK9MdfmEpcVkcdTpUpxvS                                                                        │
│  └──                                                                                                                           │
╰────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯


sui client call --package 0x606f93905a07b1fbe1c95fa1349ec08605a6ac10f6724ad7593545e3b567a4d2 --module my_token --function add_liquidity --args 0x58e02fe7f9ab3d02ab24f6c4b2d6432808fa30d0e552985033561021e2dc6e31 0xa41bc52a9379aa4b8184f04d399209635c9dce455012179d8210ef65a5a67ffb 0xdc32878d8661af9b63951d092cfc8f0a6647e97dbd845110080dfe146de8c07a --gas-budget 10000000

Created Objects:                                                                                            │
│  ┌──                                                                                                        │
│  │ ObjectID: 0xc327110c2ec28f60f194c1ebc592e2f8bb966d6d6b3155a2bc684547f9cfc133                             │
│  │ Sender: 0xe5742b83435093dfa37fc9c49ca32421572eb71fcaa303340138e4fd66884914                               │
│  │ Owner: Object ID: ( 0xd18092271167eb9396a5e74fcb0804648c519f2509a3ddf007d5818cee44586e )                 │
│  │ ObjectType: 0x2::dynamic_field::Field<address, u64>                                                      │
│  │ Version: 528531425                                                                                       │
│  │ Digest: mdCyp1kCtg98P2fCGo6Vd7WWWKEN6My6aykr2aUPMoP                                                      │
│  └──                                                                                                        │
│ Mutated Objects:                                                                                            │
│  ┌──                                                                                                        │
│  │ ObjectID: 0x3fdc2eebf99e194c0fcffc421a31469526b64b0b52d9b04c88915294a1cd74ed                             │
│  │ Sender: 0xe5742b83435093dfa37fc9c49ca32421572eb71fcaa303340138e4fd66884914                               │
│  │ Owner: Account Address ( 0xe5742b83435093dfa37fc9c49ca32421572eb71fcaa303340138e4fd66884914 )            │
│  │ ObjectType: 0x2::coin::Coin<0x2::sui::SUI>                                                               │
│  │ Version: 528531425                                                                                       │
│  │ Digest: 4oufwjWExJHCqtYV9Mzdarnv8NenMw86DBf4znDR5oW1                                                     │
│  └──                                                                                                        │
│  ┌──                                                                                                        │
│  │ ObjectID: 0x58e02fe7f9ab3d02ab24f6c4b2d6432808fa30d0e552985033561021e2dc6e31                             │
│  │ Sender: 0xe5742b83435093dfa37fc9c49ca32421572eb71fcaa303340138e4fd66884914                               │
│  │ Owner: Shared( 506700980 )                                                                               │
│  │ ObjectType: 0x606f93905a07b1fbe1c95fa1349ec08605a6ac10f6724ad7593545e3b567a4d2::my_token::LiquidityPool  │
│  │ Version: 528531425                                                                                       │
│  │ Digest: AASJR2eRTMLRvuDroZge3BtaYBGfKWAJAgQ9m6ywh9Gc                                                     │
│  └──                                                          


Pool object id: 0x58e02fe7f9ab3d02ab24f6c4b2d6432808fa30d0e552985033561021e2dc6e31