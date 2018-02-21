---
category: TQuant
order: 1
title: 架构
---

TQuant采用多进程、分布式部署方案设计，通过合理划分功能模块，实现业务功能解耦。各模块之间进程隔离，实现高效稳定的系统。

系统由三部分组成，如图所示。

<div class="pic-plus">
  <img width="640" src="tquant_arch.jpg">
</div>

除了通用的分布式部署架构，TQuant还实现了进程内模式，用于高频交易。

## 各部分说明

- [服务层](services)
- [连接层](connector)
- [应用层](applications)
- [用户策略安全保障](security)
- [TQuantApi](tquant_api)
- [技术](tech)


