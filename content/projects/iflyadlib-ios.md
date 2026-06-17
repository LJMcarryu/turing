---
title: "讯飞广告 SDK · iOS（IFLYADLib）"
description: "科大讯飞 ADX 广告 iOS SDK 的对外接入文档 — 开屏 / Banner / 插屏 / 信息流 / 激励视频五类广告，含 CocoaPods、SPM、隐私合规、服务端竞价与完整错误码。"
date: "2026-06-16"
github: "https://github.com/LJMcarryu/IFLYADLib_iOS"
tags: [ios, ad-sdk, objective-c, cocoapods, spm]
status: active
alt: "一台 iPhone 显示主屏幕上排布的 App 图标 —— 移动应用即广告 SDK 的投放载体"
---

讯飞广告 SDK（**IFLYADLib**）是科大讯飞消费者 BG「AI 营销 - ADX」面向 iOS 媒体的广告变现 SDK。一次接入即可投放**开屏、Banner、插屏、自渲染信息流、激励视频**五类广告，支持 CocoaPods 与 Swift Package Manager，内置隐私清单（`PrivacyInfo.xcprivacy`）、ATT 合规、服务端竞价（S2S）与 Header Bidding。

本文是面向接入方（媒体开发者）的**对外接入文档**：从环境要求、安装、隐私合规，到逐类广告的完整调用链与回调、错误码、最佳实践，按行业规范组织，照着做即可跑通。

## 三个仓库分别是什么

这个项目对外有三套产物，请根据需要选用——**接入方通常只需要"公开库"或"定制库"中的一套**：

::card-grid
---
items:
  - title: 公开库 IFLYADLib
    meta: 对外 · 推荐
    desc: 标准发行版，五类广告齐全，按广告形式可组合接入。
    points: ["类名 IFLYxxxAd", "CocoaPods / SPM", "当前 6.0.3"]
  - title: 定制库 YSIFLYADLib
    meta: 白标定制
    desc: YS 媒体白标版，命名加前缀、资源内嵌、动态 framework。
    points: ["类名 YSIFLYxxxAd", "方法前缀 ysifly_", "无激励视频"]
  - title: 私有库 IFLYADLibDemo
    meta: 内部源码
    desc: 完整源码 + 示例工程，仅内部使用，不对外分发。
    points: ["五类广告示例", "单元测试", "构建脚本"]
---
::

> 选择建议：常规媒体接入用**公开库 IFLYADLib**；需要避免与其他广告库符号冲突、或要求资源自包含/动态库交付的，用**定制库 YSIFLYADLib**。两者 API 形态一致，仅命名与交付方式不同（详见 [公开库与定制库差异](#公开库与定制库差异)）。

## 能力一览

::card-grid
---
items:
  - title: 开屏 Splash
    meta: IFLYSplashAd
    desc: 冷/热启动全屏曝光，倒计时、跳过、摇一摇，图片与视频素材。
  - title: Banner
    meta: IFLYBannerAd
    desc: 嵌入容器的横幅，宽度自适应，可带关闭按钮。
  - title: 插屏 Interstitial
    meta: IFLYInterstitialAd
    desc: 半屏 / 全屏弹窗，图片与视频，场景切换时插入。
  - title: 信息流 Native Feed
    meta: IFLYNativeFeedAd
    desc: 自渲染，媒体侧用原生控件排版，单图 / 三图 / 视频。
  - title: 激励视频 Reward
    meta: IFLYRewardVideoAd
    desc: 观看完整视频后发放奖励，含发奖回执回调。
  - title: 竞价能力
    meta: S2S / HB
    desc: 服务端竞价 Token、客户端 Header Bidding 胜负通知。
---
::

## 环境要求

| 项目 | 要求 |
| --- | --- |
| iOS 部署版本 | iOS 13.0 及以上 |
| Xcode | 14.1 及以上 |
| 语言 | Objective-C 接口（Swift 工程可直接桥接调用） |
| 架构 | 真机 `arm64`；6.0.3 起含模拟器切片（`arm64` / `x86_64`），可直接在模拟器调试 |
| 链接标记 | 公开库为静态 framework，**App Target 必须配置 `-ObjC`**；定制库为动态 framework，无需配置 |

## 安装 SDK

### 方式一：CocoaPods（推荐）

公开库 `IFLYADLib` 支持"按广告形式可组合接入"：`Core` 必选，其余格式按需选用，`VideoUI`（视频播放容器）由依赖关系自动带入。**只接入需要的格式可显著减小包体**。

::platform-tabs
---
platforms:
  - id: full
    name: 全量接入
    shell: Podfile — 一行接入全部五类广告
    command: "pod 'IFLYADLib', '6.0.3'"
  - id: combo
    name: 按需组合
    shell: Podfile — 例：仅开屏 + Banner（Splash 自动带入 VideoUI）
    command: "pod 'IFLYADLib/Splash', '6.0.3'; pod 'IFLYADLib/Banner', '6.0.3'"
  - id: podspec
    name: podspec 直连
    shell: Podfile — CDN 未同步时按 tag 直连
    command: "pod 'IFLYADLib/Splash', :podspec => 'https://raw.githubusercontent.com/LJMcarryu/IFLYADLib_iOS/6.0.3/IFLYADLib.podspec'"
---
::

完整 Podfile 示例：

```ruby
source 'https://cdn.cocoapods.org/'
platform :ios, '13.0'

target 'YourApp' do
  use_frameworks!

  # 全量：五类广告 + VideoUI + 内置资源
  pod 'IFLYADLib', '6.0.3'

  # 或按需组合（Core 隐式必选；Splash / Interstitial / Reward 会自动带入 VideoUI）
  # pod 'IFLYADLib/Splash', '6.0.3'
  # pod 'IFLYADLib/Banner', '6.0.3'
  # pod 'IFLYADLib/NativeFeed', '6.0.3'
end
```

```bash
pod install --repo-update
```

可选 subspec：`Core`（必选）、`Banner`、`Splash`、`Interstitial`、`NativeFeed`、`Reward`、`Full`（默认，等于全选）。

### 方式二：Swift Package Manager

在 Xcode `File › Add Package Dependencies…` 中输入仓库地址，选择版本 `6.0.3`，按需勾选 product：

```text
https://github.com/LJMcarryu/IFLYADLib_iOS
```

可选 product 与 subspec 同名：`Core`（必选）、`Banner`、`Splash`、`Interstitial`、`NativeFeed`、`Reward`、`Full`。

::card-grid
---
items:
  - title: 必配 -ObjC
    meta: 仅公开库
    desc: 在 App Target › Build Settings › Other Linker Flags 加 -ObjC，否则静态库的 category / +load 被裁剪，运行期异常。
  - title: SPM 不带资源
    meta: 注意
    desc: binaryTarget 无法随包分发 resource_bundles。用到内置素材的格式（开屏/插屏/激励 UI）经 SPM 接入需自行从 Release 合并包提取 .bundle，或改用 CocoaPods。
  - title: 隐私清单
    meta: PrivacyInfo
    desc: CocoaPods 随 Core 资源自动带入 PrivacyInfo.xcprivacy；SPM 需手动添加到 App Target。
---
::

### 导入头文件

统一使用伞头即可（`6.0.3` 起伞头用 `__has_include` 守卫，全量与按格式部分安装都能正常编译，自动只导入已安装格式的入口类）：

```objc
#import <IFLYADLib/IFLYADLib.h>
```

## 隐私与合规

### App Tracking Transparency（ATT）

iOS 14+ 读取 IDFA 前需请求用户授权。建议在 `applicationDidBecomeActive:` 或首个前台时机发起：

```objc
#import <AppTrackingTransparency/AppTrackingTransparency.h>

- (void)applicationDidBecomeActive:(UIApplication *)application {
    if (@available(iOS 14, *)) {
        if (ATTrackingManager.trackingAuthorizationStatus == ATTrackingManagerAuthorizationStatusNotDetermined) {
            [ATTrackingManager requestTrackingAuthorizationWithCompletionHandler:^(ATTrackingManagerAuthorizationStatus status) {
                NSLog(@"ATT status: %ld", (long)status);
            }];
        }
    }
}
```

`Info.plist` 需补充用途说明：

```xml
<key>NSUserTrackingUsageDescription</key>
<string>用于向你展示更相关的广告内容</string>
```

未授权时 IDFA 读取应返回空，由 SDK 走非个性化链路。媒体侧可把 IDFA 通过 `IFLYAdRequestConfig.idfa` 传入（见下一节）。

### 个性化与日志开关

```objc
// 媒体侧个性化推荐开关（记录媒体侧状态）
[IFLYAdConfig setPersonalizedEnabled:YES];

// SDK 日志：Debug 默认开启，正式上线前建议关闭
[IFLYAdConfig setLogEnabled:NO];
```

### 隐私清单要点

SDK 已内置 `PrivacyInfo.xcprivacy`：声明 `NSPrivacyTracking = YES`，追踪域名包含 `voiceads.cn` 等；采集数据类型涵盖 DeviceID、ProductInteraction、AdvertisingData（用户关联、用于追踪）与 OtherDiagnosticData；并声明了 UserDefaults（CA92.1）、文件时间戳（C617.1）、系统启动时间（35F9.1）、磁盘可用空间（E174.1）等 Required Reason API。提审前请确认隐私清单已随包合入。

## 初始化与请求配置

### 全局初始化

在 `AppDelegate` 启动时完成全局配置（无需 appId/secret，广告位粒度由 `adUnitId` 区分）：

```objc
#import <IFLYADLib/IFLYADLib.h>

- (BOOL)application:(UIApplication *)application
    didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    [IFLYAdConfig setPersonalizedEnabled:YES];
    [IFLYAdConfig setLogEnabled:NO];   // 正式环境关闭
    return YES;
}
```

### 统一请求配置 IFLYAdRequestConfig

每次加载广告可传入一个 `IFLYAdRequestConfig`，用于竞价底价、超时、设备标识等。常用字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `requestId` | `NSString *` | 请求 ID，不设则 SDK 自动生成 |
| `settleType` | `NSNumber *` | 交易方式：`0` 固定价，`1` RTB |
| `bidFloor` | `NSNumber *` | 竞价底价，单位 元 / 千次展示（CPM） |
| `interactStatus` | `NSNumber *` | 互动开关：`1` 开启，`2` 关闭 |
| `appName` / `appVersion` | `NSString *` | App 名称 / 版本号 |
| `requestTimeout` | `NSNumber *` | 请求超时（秒） |
| `idfa` | `NSString *` | 媒体侧传入的 IDFA（ATT 授权后） |
| `caidList` | `NSArray<NSDictionary *> *` | 媒体侧传入的 CAID 列表 |
| `userAgent` | `NSString *` | 自定义 UA |
| `deepLinkDisabled` | `NSNumber *` | 是否禁用 DeepLink 外跳 |

封装一个工具方法复用：

```objc
+ (IFLYAdRequestConfig *)sharedRequestConfig {
    IFLYAdRequestConfig *config = [[IFLYAdRequestConfig alloc] init];
    config.settleType = @1;          // RTB
    config.bidFloor = @0.01;         // 底价 0.01 元/千次
    config.interactStatus = @1;      // 开启互动
    config.requestTimeout = @5;      // 5 秒超时
    config.appName = NSBundle.mainBundle.infoDictionary[@"CFBundleDisplayName"];
    config.appVersion = NSBundle.mainBundle.infoDictionary[@"CFBundleShortVersionString"];
    config.idfa = [self currentIDFAStringOrNil];   // ATT 未授权返回 nil
    return config;
}
```

## 通用接入范式

五类广告共享同一套生命周期：**创建实例 → 设置 delegate → 发起加载 → 收到就绪回调后展示 → 用完销毁**。理解这条主线，任意一种广告都能照搬。

::step-list
---
steps:
  - title: 创建实例并设置 delegate
    desc: 用广告位 ID 初始化，delegate 必须在 loadAd 之前设置；并设置承载落地页跳转的 currentViewController。
    code: "IFLYBannerAd *ad = [[IFLYBannerAd alloc] initWithAdUnitId:adUnitId]; ad.delegate = self; ad.currentViewController = self;"
  - title: 发起加载
    desc: 传入统一请求配置；SDK 会回调 didLoad（响应解析成功）、didReady（主素材就绪）。
    code: "[ad loadAdWithRequestConfig:[MyAds sharedRequestConfig]];"
  - title: 就绪后展示
    desc: "在 didReady 回调中、确认 isAdValid 后再展示。不同广告展示入口不同（showInView: / showAdFromRootViewController:config: / bindAdWithViewBinder:error:）。"
    code: "if ([ad isAdValid]) { [ad showInView:self.container]; }"
  - title: 监听交互与失败
    desc: 通过 delegate 感知曝光 didExpose、点击 didClick、关闭 didClose 与统一失败出口 didFailWithError:。
  - title: 销毁
    desc: 用完先把 delegate 置 nil 再 destroy；广告对象为一次性消费，不能复用。
    code: "ad.delegate = nil; [ad destroy];"
---
::

**生命周期状态 `IFLYAdState`**：`Idle → Loading → Loaded → Ready → Showing → Exposed → Closed → Destroyed`，异常进入 `Failed`。其中信息流（NativeFeed）没有 `Ready` 阶段，`Loaded` 之后直接进入绑定（bind），其余四类才经过 `Ready`（即 `didReady`）。

通用约束（适用于全部广告类型）：

- **强持有广告对象**：用属性持有，loadAd 后不要让对象被提前释放。
- **delegate 为弱引用**：在 `dealloc` / 退出页面前把 `delegate = nil`，再 `destroy`，避免野指针回调。
- **先 `didReady` 后展示**：`didLoad` 仅表示响应解析成功，素材未必下载完；`didReady`（或对应"就绪"回调）才可展示。
- **一次性消费**：广告已展示 / 已关闭 / 已销毁后不可再次 `loadAd`，需新建实例。
- **替换真实广告位**：示例中的 `adUnitId` 仅供演示，上线前替换为平台分配的正式广告位。

下面逐类给出完整调用链与关键回调。

## 开屏广告 Splash

开屏不走 `present`，而是直接加到 window 上展示，带倒计时、跳过与可选的"摇一摇/扭一扭"互动。

```objc
@interface SplashVC () <IFLYSplashAdDelegate>
@property (nonatomic, strong) IFLYSplashAd *splashAd;
@end

@implementation SplashVC

- (void)loadAd {
    IFLYSplashAd *ad = [[IFLYSplashAd alloc] initWithAdUnitId:adUnitId];
    ad.delegate = self;
    ad.currentViewController = self;
    self.splashAd = ad;
    [ad loadAdWithRequestConfig:[MyAds sharedRequestConfig]];
}

// 主素材就绪，可以展示
- (void)splashAdDidReady:(IFLYSplashAd *)ad {
    if (![ad isAdValid]) return;

    IFLYSplashAdConfig *config = [[IFLYSplashAdConfig alloc] init];
    config.traceDuration = 5;                 // 倒计时秒数（3–5，默认 5）
    config.mediumBottomView = [self logoView]; // 底部自定义 Logo 区
    config.muteOnStart = YES;                  // 视频起播静音
    config.showNoAds = NO;                     // 是否显示"免除广告"按钮
    [ad showAdFromRootViewController:self config:config];
}

- (void)splashAdDidExpose:(IFLYSplashAd *)ad { /* 曝光计费成立 */ }
- (void)splashAdDidClick:(IFLYSplashAd *)ad { /* 点击 */ }
- (void)splashAdDidSkip:(IFLYSplashAd *)ad  { /* 用户跳过 */ }
- (void)splashAdDidClose:(IFLYSplashAd *)ad { [self enterApp]; }   // 关闭后进主界面
- (void)splashAd:(IFLYSplashAd *)ad didFailWithError:(IFLYAdError *)error {
    NSLog(@"开屏失败 %ld %@", (long)error.errorCode, error.errorDescription);
    [self enterApp];
}

- (void)dealloc {
    self.splashAd.delegate = nil;
    [self.splashAd destroy];
}
@end
```

**`IFLYSplashAdConfig` 关键属性**：`traceDuration`（倒计时 3–5s）、`mediumBottomView`（底部自定义视图）、`customWindow`（自定义承载 window）、`headingInteractionEnabled`（摇一摇/扭一扭）、`showNoAds`（"免除广告"按钮）、`muteOnStart` / `muteButtonHidden`。

**主要回调（`IFLYSplashAdDelegate`）**：

| 回调 | 时机 |
| --- | --- |
| `splashAdDidLoad:` | 响应解析成功（可读 `adData` 做竞价决策） |
| `splashAdDidReady:` | 主素材就绪，可展示 |
| `splashAdDidShow:` / `splashAdDidExpose:` | 已展示 / 有效曝光 |
| `splashAdDidClick:` | 用户点击 |
| `splashAdDidSkip:` / `splashAdDidTapNoAds:` | 跳过 / 点击"免除广告" |
| `splashAdDidClose:` | 倒计时结束或关闭（务必在此进入主界面） |
| 视频事件 | `splashAdDidStartPlay:` / `splashAdDidPausePlay:` / `splashAdDidResumePlay:` / `splashAdDidPlayFinish:` / `splashAd:didFailToPlayWithError:` |
| `splashAd:didFailWithError:` | 加载或展示失败（统一出口，也应进入主界面） |

## Banner 广告

Banner 展示到媒体提供的容器中，容器宽度需 `> 0`，高度为 `0` 时按素材自适应。

```objc
@interface BannerVC () <IFLYBannerAdDelegate>
@property (nonatomic, strong) IFLYBannerAd *bannerAd;
@end

@implementation BannerVC

- (void)loadAd {
    IFLYBannerAd *ad = [[IFLYBannerAd alloc] initWithAdUnitId:adUnitId];
    ad.delegate = self;
    ad.currentViewController = self;
    ad.closeButtonVisible = YES;     // 右上角关闭按钮
    self.bannerAd = ad;
    [ad loadAdWithRequestConfig:[MyAds sharedRequestConfig]];
}

- (void)bannerAdDidReady:(IFLYBannerAd *)ad {
    if ([ad isAdValid]) {
        [ad showInView:self.bannerContainer];   // 展示到容器
    }
}

- (void)bannerAdDidClose:(IFLYBannerAd *)ad { [self.bannerContainer removeFromSuperview]; }
- (void)bannerAd:(IFLYBannerAd *)ad didFailWithError:(IFLYAdError *)error {
    NSLog(@"Banner 失败 %ld %@", (long)error.errorCode, error.errorDescription);
}

- (void)dealloc {
    self.bannerAd.delegate = nil;
    [self.bannerAd destroy];
}
@end
```

**主要回调（`IFLYBannerAdDelegate`）**：`bannerAdDidLoad:`、`bannerAdDidReady:`（可 `showInView:`）、`bannerAdDidExpose:`、`bannerAdDidClick:`、`bannerAdDidClose:`（用户关闭）、`bannerAd:didFailWithError:`。

## 插屏广告 Interstitial

插屏以 `present` 方式弹出，支持半屏 / 全屏两种样式，图片与视频素材。

```objc
@interface InterstitialVC () <IFLYInterstitialAdDelegate>
@property (nonatomic, strong) IFLYInterstitialAd *interstitialAd;
@end

@implementation InterstitialVC

- (void)loadAd {
    IFLYInterstitialAd *ad = [[IFLYInterstitialAd alloc] initWithAdUnitId:adUnitId];
    ad.delegate = self;
    ad.currentViewController = self;
    self.interstitialAd = ad;
    [ad loadAdWithRequestConfig:[MyAds sharedRequestConfig]];
}

- (void)interstitialAdDidReady:(IFLYInterstitialAd *)ad {
    if (![ad isAdValid]) return;

    IFLYInterstitialAdConfig *config = [[IFLYInterstitialAdConfig alloc] init];
    config.presentationStyle = IFLYInterstitialPresentationStyleHalfScreen; // 或 FullScreen
    config.muteOnStart = YES;
    [ad showAdFromRootViewController:self config:config];
}

- (void)interstitialAdDidClose:(IFLYInterstitialAd *)ad { /* 关闭 */ }
- (void)interstitialAd:(IFLYInterstitialAd *)ad didFailWithError:(IFLYAdError *)error {
    NSLog(@"插屏失败 %ld %@", (long)error.errorCode, error.errorDescription);
}

- (void)dealloc {
    self.interstitialAd.delegate = nil;
    [self.interstitialAd destroy];
}
@end
```

**展示样式枚举**：

```objc
typedef NS_ENUM(NSInteger, IFLYInterstitialPresentationStyle) {
    IFLYInterstitialPresentationStyleHalfScreen = 0,  // 半屏（默认）
    IFLYInterstitialPresentationStyleFullScreen = 1,  // 全屏
};
```

**主要回调（`IFLYInterstitialAdDelegate`）**：`interstitialAdDidLoad:`、`interstitialAdDidReady:`、`interstitialAdDidShow:`、`interstitialAdDidRender:` / `didFailToRenderWithError:`、`interstitialAdDidExpose:`、`interstitialAdDidClick:`、视频事件（`interstitialAdDidStartPlay:` / `interstitialAdDidPlayFinish:` / `interstitialAd:didFailToPlayWithError:` 等）、`interstitialAdDidClose:`、`interstitialAd:didFailWithError:`。

## 信息流广告 Native Feed

信息流是**自渲染**：SDK 只回传素材数据（`adData`），由媒体侧用自己的原生控件排版，再通过 `IFLYNativeFeedAdViewBinder` 把容器、点击区、关闭按钮、视频承载视图交还给 SDK 完成曝光与点击监测。SDK 不会向你的容器添加任何 UI。

```objc
@interface NativeVC () <IFLYNativeFeedAdDelegate>
@property (nonatomic, strong) IFLYNativeFeedAd *nativeAd;
@end

@implementation NativeVC

- (void)loadAd {
    IFLYNativeFeedAd *ad = [[IFLYNativeFeedAd alloc] initWithAdUnitId:adUnitId];
    ad.delegate = self;
    ad.currentViewController = self;
    ad.muteOnStart = YES;
    self.nativeAd = ad;
    [ad loadAdWithRequestConfig:[MyAds sharedRequestConfig]];
}

// 1) 请求成功：读取素材数据，用媒体侧控件自行渲染
- (void)nativeFeedAdDidLoad:(IFLYNativeFeedAd *)ad {
    IFLYNativeFeedAdData *data = ad.adData;
    self.titleLabel.text = data.title;
    self.descLabel.text  = data.desc ?: data.content;
    [self.ctaButton setTitle:(data.actionText ?: @"查看详情") forState:UIControlStateNormal];
    // 按 data.materialType 渲染单图 / 三图 / 视频；图片地址见 data.imageURLs，视频见 data.videoURL

    // 2) 渲染完成后绑定给 SDK
    IFLYNativeFeedAdViewBinder *binder = [[IFLYNativeFeedAdViewBinder alloc] init];
    binder.containerView = self.adContainer;                                  // 必填
    binder.renderViews   = @[self.mediaContainer, self.titleLabel, self.descLabel, self.ctaButton];
    binder.clickViews    = @[self.mediaContainer, self.ctaButton];           // 可点击区
    binder.closeView     = self.closeButton;
    binder.videoView     = ad.hasVideoTemplate ? self.mediaContainer : nil;  // 视频素材必填

    IFLYAdError *error = nil;
    if (![ad bindAdWithViewBinder:binder error:&error]) {
        NSLog(@"信息流绑定失败 %ld %@", (long)error.errorCode, error.errorDescription);
    }
}

- (void)nativeFeedAdDidRender:(IFLYNativeFeedAd *)ad {
    if (ad.hasVideoTemplate) { [ad startPlay]; }
}

- (void)nativeFeedAdDidClose:(IFLYNativeFeedAd *)ad { /* 用户关闭 */ }

// 列表 cell 复用前务必解绑
- (void)prepareForReuse {
    [self.nativeAd unbindAd];
}

- (void)dealloc {
    self.nativeAd.delegate = nil;
    [self.nativeAd destroy];
}
@end
```

**素材类型枚举**：

```objc
typedef NS_ENUM(NSInteger, IFLYNativeFeedAdMaterialType) {
    IFLYNativeFeedAdMaterialTypeUnknown     = 0,
    IFLYNativeFeedAdMaterialTypeSingleImage = 1,  // 单图
    IFLYNativeFeedAdMaterialTypeThreeImages = 2,  // 三图
    IFLYNativeFeedAdMaterialTypeVideo       = 3,  // 视频
};
```

**`IFLYNativeFeedAdViewBinder` 关键字段**：`containerView`（必填）、`renderViews`、`clickViews`、`closeView`、`videoView`（视频素材必填），以及语义视图 `titleView` / `descView` / `iconView` / `imageView` / `adSourceView` / `ctaView`。

**`IFLYNativeFeedAdData` 常用字段**：`materialType`、`title`、`desc`、`content`、`actionText`、`iconURL`、`imageURLs`、`videoURL`、`videoCoverURL`、`videoDuration`、`ecpm`，并提供 `isMaterialComplete` 校验素材是否满足渲染要求。

**主要回调（`IFLYNativeFeedAdDelegate`）**：`nativeFeedAdDidLoad:`（自渲染）、`nativeFeedAdDidRender:`（绑定成功）/ `didFailToRenderWithError:`、`nativeFeedAdDidExpose:`、`nativeFeedAdDidClick:`、视频事件、`nativeFeedAdDidClose:`、`nativeFeedAd:didFailWithError:`。

> 复用要点：列表场景在 cell 复用前必须调用 `unbindAd` 清理绑定状态；绑定为一次性消费，`unbindAd` 不会把对象复位为可重新绑定。

## 激励视频广告 Reward

用户观看完整视频后发放奖励。**发奖以 `didRewardEffective:` 回调为准**，`didClose:` 仅表示广告关闭，不等同于发奖。

```objc
@interface RewardVC () <IFLYRewardVideoAdDelegate>
@property (nonatomic, strong) IFLYRewardVideoAd *rewardAd;
@end

@implementation RewardVC

- (void)loadAd {
    IFLYRewardVideoAd *ad = [[IFLYRewardVideoAd alloc] initWithAdUnitId:adUnitId];
    ad.delegate = self;
    ad.currentViewController = self;
    self.rewardAd = ad;
    [ad loadAdWithRequestConfig:[MyAds sharedRequestConfig]];
}

- (void)rewardVideoAdDidReady:(IFLYRewardVideoAd *)ad {
    if (![ad isAdValid]) return;
    IFLYRewardVideoAdConfig *config = [[IFLYRewardVideoAdConfig alloc] init];
    config.muteOnStart = YES;
    [ad showAdFromRootViewController:self config:config];
}

// 激励发放生效 —— 在这里给用户发奖
- (void)rewardVideoAd:(IFLYRewardVideoAd *)ad didRewardEffective:(NSDictionary *)info {
    [self grantRewardToUser];
}

- (void)rewardVideoAdDidClose:(IFLYRewardVideoAd *)ad { /* 关闭，不在此发奖 */ }
- (void)rewardVideoAd:(IFLYRewardVideoAd *)ad didFailWithError:(IFLYAdError *)error {
    NSLog(@"激励失败 %ld %@", (long)error.errorCode, error.errorDescription);
}

- (void)dealloc {
    self.rewardAd.delegate = nil;
    [self.rewardAd destroy];
}
@end
```

**主要回调（`IFLYRewardVideoAdDelegate`）**：`rewardVideoAdDidLoad:`、`rewardVideoAdDidReady:`、`rewardVideoAdDidShow:`、`rewardVideoAdDidExpose:`、`rewardVideoAdDidClick:`、视频事件、**`rewardVideoAd:didRewardEffective:`（发奖准绳）**、`rewardVideoAdDidClose:`、`rewardVideoAd:didFailWithError:`。

## 服务端竞价与 Header Bidding

### 客户端获取 SDK 竞价 Token（S2S）

```objc
NSError *error = nil;
NSString *sdkToken = [IFLYAdSDK getSdkTokenWithAdUnitId:@"YOUR_AD_UNIT_ID" error:&error];
if (!sdkToken) {
    NSLog(@"获取 SDK Token 失败: %@", error);
}
// 将 sdkToken 上送你的服务端，向 ADX 发起服务端竞价，拿到 rspToken 后回传客户端
```

### 用服务端竞价结果加载（所有广告类型通用）

```objc
[splashAd       loadAdWithServerBiddingToken:rspToken];
[bannerAd       loadAdWithServerBiddingToken:rspToken];
[interstitialAd loadAdWithServerBiddingToken:rspToken];
[nativeAd       loadAdWithServerBiddingToken:rspToken];
[rewardAd       loadAdWithServerBiddingToken:rspToken];
```

### Header Bidding 胜负通知

```objc
if (ad.bidInfo.winNoticeAvailable) {
    [ad sendBidResultWithType:IFLYAdBidResultTypeWin reason:@"win"];
} else {
    [ad sendBidResultWithType:IFLYAdBidResultTypeLoseBidLower reason:@"loss"];
}
```

**竞价结果类型 `IFLYAdBidResultType`**：`Win = 100`、`LoseBidLower = 101`、`LoseCreativePending = 102`、`LoseCreativeRejected = 103`、`LosePriorityLower = 104`、`Error = 105`、`Timeout = 106`。

## 错误码

所有失败统一通过各广告的 `...didFailWithError:` 回调返回 `IFLYAdError`，读取 `error.errorCode` 与 `error.errorDescription`。错误码按段划分：

**服务端（70xxx）**

| 码 | 含义 |
| --- | --- |
| 70200 | 请求成功 |
| 70204 | 无填充（No Fill） |
| 70400 | 无效广告位 |
| 70401 / 70404 | S2S Token 为空 / 无效或过期 |
| 70403 | 超过日请求次数上限 |
| 70500 | 服务端内部错误 |

**通用客户端（71xxx）**

| 码 | 含义 |
| --- | --- |
| 71001 | 未知错误 |
| 71002 | 无效请求 |
| 71003 | 网络连接错误 |
| 71004 | 权限未授予 |
| 71005 | 广告位 ID 为空 |
| 71006 | 请求超时 |
| 71007 / 71008 | ViewController 为空 / 父视图为空 |

**各广告专属段**：激励视频 `712xx`、Banner `713xx`、插屏 `714xx`、信息流 `715xx`、开屏 `716xx`（例如 `71203` 激励未就绪、`71308` Banner 未就绪、`71406` 插屏未就绪、`71505` 信息流未就绪、`71603` 开屏未就绪；以及各类"已展示/已过期/已销毁/素材无效"等细分码）。

## 公开库与定制库差异

定制库 **YSIFLYADLib** 与公开库 API 形态一致，但做了白标改造，主要差异如下：

| 维度 | 公开库 IFLYADLib | 定制库 YSIFLYADLib |
| --- | --- | --- |
| 当前版本 | 6.0.3 | 1.0.2 |
| 类名 | `IFLYSplashAd` … | `YSIFLYSplashAd` …（加 `YS` 前缀） |
| 公开方法 | `loadAdWithRequestConfig:` / `showInView:` / `destroy` | `ysifly_loadAdWithRequestConfig:` / `ysifly_showInView:` / `ysifly_destroy`（加 `ysifly_` 前缀） |
| delegate 方法 | `splashAdDidReady:` … | `ysifly_splashAdDidReady:` …（加 `ysifly_` 前缀） |
| 错误类型 | `IFLYAdError` | `YSIFLYAdError` |
| 伞头 | `#import <IFLYADLib/IFLYADLib.h>` | `#import <YSIFLYADLib/YSIFLYADLib.h>` |
| 广告类型 | 开屏 / Banner / 插屏 / 信息流 / **激励视频** | 开屏 / Banner / 插屏 / 信息流（**无激励视频**） |
| 交付形态 | 静态 framework，**需 `-ObjC`** | 动态 framework，**无需 `-ObjC`** |
| 资源 | 随 Core 资源带入 | 资源（`YSAdvSDK.bundle`）内嵌于 framework |

定制库安装（CocoaPods 经 raw podspec 直连）：

```ruby
source 'https://cdn.cocoapods.org/'
platform :ios, '13.0'

target 'YourApp' do
  use_frameworks!
  pod 'YSIFLYADLib', :podspec => 'https://raw.githubusercontent.com/LJMcarryu/YSIFLYADLib_iOS/1.0.2/YSIFLYADLib.podspec'
end
```

SPM：`https://github.com/LJMcarryu/YSIFLYADLib_iOS.git`，版本 `1.0.2`，product `YSIFLYADLib`。

调用对照（以开屏为例）：

```objc
// 公开库（方法名无前缀，与前文主线一致：统一传 IFLYAdRequestConfig）
IFLYSplashAd *ad = [[IFLYSplashAd alloc] initWithAdUnitId:@"xxx"];
[ad loadAdWithRequestConfig:[MyAds sharedRequestConfig]];
// …didReady 后：[ad showAdFromRootViewController:self config:config];

// 定制库（类名加 YS 前缀、方法加 ysifly_ 前缀，调用形态与公开库一致）
YSIFLYSplashAd *ad = [[YSIFLYSplashAd alloc] initWithAdUnitId:@"xxx"];
[ad ysifly_loadAdWithRequestConfig:[MyAds sharedRequestConfig]];
// …didReady 后：[ad ysifly_showAdFromRootViewController:self config:config];
```

## 最佳实践

- **提前加载、就绪展示**：开屏/激励等强曝光场景建议提前发起 `loadAd`，在 `didReady` 后再展示，缩短用户等待。
- **每次展示新建实例**：广告对象一次性消费，展示/关闭后请重新 `initWithAdUnitId:` 创建。
- **正确释放**：退出页面或 `dealloc` 时先 `delegate = nil` 再 `destroy`；信息流 cell 复用前 `unbindAd`。
- **失败要兜底**：开屏/插屏在 `didFailWithError:` 与 `didClose:` 都要保证业务流程继续（如进入主界面）。
- **激励发奖只认回执**：仅在 `didRewardEffective:` 发奖，避免重复或漏发。
- **上线前收尾**：关闭 `setLogEnabled:`、替换正式广告位、确认隐私清单与 ATT 文案已就绪。

## 常见问题

::faq-list
---
items:
  - q: pod install 找不到 6.0.3 版本怎么办？
    a: CocoaPods CDN 同步有延迟时，先执行 pod install --repo-update；仍不行则用 podspec 直连写法：pod 'IFLYADLib/Splash', :podspec => 'https://raw.githubusercontent.com/LJMcarryu/IFLYADLib_iOS/6.0.3/IFLYADLib.podspec'。
  - q: 真机正常、模拟器编译报架构错误？
    a: 6.0.3 起 xcframework 已含模拟器切片，可直接在模拟器调试；若使用 6.0.0 等旧版则仅提供真机 arm64，请升级到 6.0.3。
  - q: 运行时类找不到 / category 方法不生效 / 崩溃？
    a: 公开库是静态 framework，必须在 App Target 的 Other Linker Flags 加 -ObjC，否则 category 与 +load 会被链接器裁剪。定制库为动态 framework，无需此配置。
  - q: 广告图片或内置素材缺失（图标、播放控件不显示）？
    a: 多见于用 SPM 接入需要内置素材的格式。SPM 的 binaryTarget 不随包分发资源 bundle，请改用 CocoaPods，或从 GitHub Release 合并包中提取 .bundle 手动加入 App Target。定制库资源已内嵌，无此问题。
  - q: IDFA 一直为空？
    a: iOS 14+ 必须先通过 ATT 取得用户授权，未授权时应返回空 IDFA 并走非个性化链路；并确认 Info.plist 配置了 NSUserTrackingUsageDescription。
  - q: Banner 不显示？
    a: 确认容器宽度大于 0，且在 didReady（isAdValid 为 YES）之后再调用 showInView:；高度为 0 时按素材自适应。
  - q: 激励视频该在什么时候发奖？
    a: "以 rewardVideoAd:didRewardEffective: 回调为准，不要在 didClose: 里发奖；该回调保证发奖只生效一次。"
  - q: 同一个广告对象能复用吗？
    a: 不能。广告为一次性消费，展示/关闭/销毁后需重新创建实例再 loadAd。
---
::

## 版本与支持

| 版本 | 要点 |
| --- | --- |
| 6.0.3（推荐） | 伞头 `__has_include` 守卫，部分安装也可直接用伞头；二进制与 6.0.2 一致 |
| 6.0.2 | 模型 A 补齐 `PrivacyInfo.xcprivacy`，CocoaPods 随 Core 资源带入 |
| 6.0.1 | 首次推出"按广告形式可组合接入"，各模块独立 xcframework |
| 6.0.0 | API 大版本：公开五类广告入口与统一请求配置 `IFLYAdRequestConfig` |

从 6.0.0 升级到 6.0.3：业务 API 无变化，可改为按广告形式组合接入；CocoaPods 直接升级版本号即可，无需改业务代码。

- 公开库：[github.com/LJMcarryu/IFLYADLib_iOS](https://github.com/LJMcarryu/IFLYADLib_iOS) · 通过 Issue 反馈问题（暂不接受外部 PR；安全漏洞请私密上报）
- 定制库：[github.com/LJMcarryu/YSIFLYADLib_iOS](https://github.com/LJMcarryu/YSIFLYADLib_iOS)
- 各仓库均自带可运行示例工程（公开库 `IFLYADLibSimple`、定制库 `YSIFLYADLibSimple`），覆盖全部广告类型，可对照源码接入。
