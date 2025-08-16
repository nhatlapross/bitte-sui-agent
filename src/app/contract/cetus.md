---
description: >-
  The developer documents listed here are for Sui network only. To follow the
  latest updates of packages and SDK, you can join our Cetus Dev Notification
  channel on Telegram: https://t.me/CetusDevNews
---

# Dev Overview

## **Token Address:**

#### **CETUS Token CoinType**

0x6864a6f921804860930db6ddbe2e16acdf8504495ea7481637a1c8b9a8fe54b::cetus::CETUS

#### **xCETUS token coin\_type**

0x9e69acc50ca03bc943c4f7c5304c2a6002d507b51c11913b247159c60422c606::xcetus::XCETUS



## **SDKs & Contract Endpoints:**&#x20;

There are two apporaches for integrating with Cetus Protocol. The first involves utilizing the Typescript SDK, which grants you the ablilty to perform a wide range of actions. This encompasses queries, liquidity operations, and displaying data on the frontend. The alternative method entails a direct integration with Cetus CLMM contract. You can choose your integration method according to your actual demand.

#### Typescript **SDK:**&#x20;

{% embed url="https://www.npmjs.com/package/@cetusprotocol/cetus-sui-clmm-sdk" %}

{% embed url="https://github.com/CetusProtocol/cetus-clmm-sui-sdk" fullWidth="false" %}

{% embed url="https://www.npmjs.com/package/@cetusprotocol/sui-clmm-sdk" %}

**Smart Contract Endpoints**:&#x20;

{% embed url="https://github.com/CetusProtocol/cetus-clmm-interface" %}

## Latest contract address:

Here is a list of primary contract addresses.  We will update this form in real time. Please stay tuned for the updates here to ensure that your configuration is up to date.

* **clmmpool** is  the core LP contract for Cetus. It's used by both SDK and contract endpoints method.
* **integrate** is the integration contract used by the SDK method.
* **cetus\_config** is the config contract used by the SDK method.

{% tabs %}
{% tab title="Mainnet" %}
<table data-full-width="true"><thead><tr><th width="147">Contract</th><th width="115">Type<select><option value="3c48bd41b3764f879024040b7c9957c9" label="package-id" color="blue"></option><option value="b8351b63903e40bc966b256d4a14fdb7" label="published-at" color="blue"></option></select></th><th>MVR Name</th><th>Mainnet Address</th></tr></thead><tbody><tr><td>clmm_pool</td><td><span data-option="3c48bd41b3764f879024040b7c9957c9">package-id</span></td><td>@cetuspackages/clmm</td><td>0x1eabed72c53feb3805120a081dc15963c204dc8d091542592abaf7a35689b2fb</td></tr><tr><td>clmm_pool</td><td><span data-option="b8351b63903e40bc966b256d4a14fdb7">published-at</span></td><td>@cetuspackages/clmm</td><td>0x687e4b27fd88de55f2d7023dc7a3ec07ccd28b6a45a35ac88e95b6c387a3e338</td></tr><tr><td>integrate</td><td><span data-option="3c48bd41b3764f879024040b7c9957c9">package-id</span></td><td>@cetuspackages/integrate</td><td>0x996c4d9480708fb8b92aa7acf819fb0497b5ec8e65ba06601cae2fb6db3312c3</td></tr><tr><td>integrate</td><td><span data-option="b8351b63903e40bc966b256d4a14fdb7">published-at</span></td><td>@cetuspackages/integrate</td><td>0xb2db7142fa83210a7d78d9c12ac49c043b3cbbd482224fea6e3da00aa5a5ae2d</td></tr><tr><td>cetus_config</td><td><span data-option="3c48bd41b3764f879024040b7c9957c9">package-id</span></td><td>@cetuspackages/config</td><td>0x95b8d278b876cae22206131fb9724f701c9444515813042f54f0a426c9a3bc2f</td></tr><tr><td>cetus_config</td><td><span data-option="b8351b63903e40bc966b256d4a14fdb7">published-at</span></td><td>@cetuspackages/config</td><td>0xba7e740c3c002673dbe69ad5fbdb0691ec260170e141297cefb982e7081fde52</td></tr></tbody></table>
{% endtab %}

{% tab title="Testnet" %}
<table data-full-width="true"><thead><tr><th width="159">Contract</th><th width="115">Type<select><option value="3c48bd41b3764f879024040b7c9957c9" label="package-id" color="blue"></option><option value="b8351b63903e40bc966b256d4a14fdb7" label="published-at" color="blue"></option></select></th><th>Mainnet Address</th></tr></thead><tbody><tr><td>clmm_pool</td><td><span data-option="3c48bd41b3764f879024040b7c9957c9">package-id</span></td><td>0x0c7ae833c220aa73a3643a0d508afa4ac5d50d97312ea4584e35f9eb21b9df12</td></tr><tr><td>clmm_pool</td><td><span data-option="b8351b63903e40bc966b256d4a14fdb7">published-at</span></td><td>0xb2a1d27337788bda89d350703b8326952413bd94b35b9b573ac8401b9803d018</td></tr><tr><td>integrate</td><td><span data-option="3c48bd41b3764f879024040b7c9957c9">package-id</span></td><td>0x2918cf39850de6d5d94d8196dc878c8c722cd79db659318e00bff57fbb4e2ede</td></tr><tr><td>integrate</td><td><span data-option="b8351b63903e40bc966b256d4a14fdb7">published-at</span></td><td>0x19dd42e05fa6c9988a60d30686ee3feb776672b5547e328d6dab16563da65293</td></tr><tr><td>cetus_config</td><td><span data-option="3c48bd41b3764f879024040b7c9957c9">package-id</span></td><td>0xf5ff7d5ba73b581bca6b4b9fa0049cd320360abd154b809f8700a8fd3cfaf7ca</td></tr><tr><td>cetus_config</td><td><span data-option="b8351b63903e40bc966b256d4a14fdb7">published-at</span></td><td>0xf5ff7d5ba73b581bca6b4b9fa0049cd320360abd154b809f8700a8fd3cfaf7ca</td></tr></tbody></table>
{% endtab %}
{% endtabs %}

## Latest clmm sdk npm package version

{% hint style="info" %}
npm package  latest version: 5.4.0
{% endhint %}

## Latest endpoint contract version

{% tabs %}
{% tab title="Mainnet" %}
```
CetusClmm = { git = "https://github.com/CetusProtocol/cetus-clmm-interface.git", subdir = "sui/cetus_clmm", rev = "mainnet-v1.26.0", override = true }
```
{% endtab %}

{% tab title="Testnet" %}
```
CetusClmm = { git = "https://github.com/CetusProtocol/cetus-clmm-interface.git", subdir = "sui/cetus_clmm", rev = "testnet-v1.26.0", override = true }
```
{% endtab %}
{% endtabs %}



**Now, you can select one approach to integrate with the service of Cetus Protocol:**

{% content-ref url="via-sdk" %}
[via-sdk](via-sdk)
{% endcontent-ref %}

{% content-ref url="via-contract" %}
[via-contract](via-contract)
{% endcontent-ref %}
