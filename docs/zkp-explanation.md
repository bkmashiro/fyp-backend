# 零知识证明在艺术品所有权验证中的应用

## 1. 数学基础

### 1.1 有限域和椭圆曲线
- 使用 BN128 椭圆曲线：$E: y^2 = x^3 + 3$
- 定义在有限域 $\mathbb{F}_p$ 上，其中 $p$ 是一个大素数
- 曲线上的点构成一个循环群 $G$

### 1.2 Poseidon 哈希函数
- 基于置换网络构建的哈希函数
- 输入：两个元素 $(x, y) \in \mathbb{F}_p^2$
- 输出：一个元素 $h \in \mathbb{F}_p$
- 数学表示：$h = \text{Poseidon}(x, y)$

### 1.3 Groth16 证明系统
- 基于 R1CS (Rank-1 Constraint System) 的零知识证明系统
- 证明者知道见证 $w$，满足 $Aw \circ Bw = Cw$
- 其中 $A, B, C$ 是约束矩阵，$\circ$ 表示逐元素乘法

## 2. 电路设计

### 2.1 所有权证明电路
```circom
template Ownership() {
    signal input sigHash;      // 签名哈希
    signal input artHash;      // 艺术品哈希
    signal output commitment;  // 承诺值

    component hash = Poseidon(2);
    hash.inputs[0] <== sigHash;
    hash.inputs[1] <== artHash;

    commitment <== hash.out;
}
```

### 2.2 电路约束
- 输入约束：$sigHash, artHash \in \mathbb{F}_p$
- 输出约束：$commitment = \text{Poseidon}(sigHash, artHash)$
- 见证：$(sigHash, artHash)$

## 3. 证明生成过程

### 3.1 输入准备
1. 艺术品数据：$data = \text{"Test Artwork #1"}$
2. 计算艺术品哈希：$artHash = \text{keccak256}(data)$
3. 生成签名：$sig = \text{sign}(artHash, sk)$
4. 从签名恢复地址：$addr = \text{recover}(sig, artHash)$

### 3.2 证明生成
1. 计算见证：$w = (sigHash, artHash)$
2. 生成证明：$\pi = (A, B, C)$
   - $A = \alpha + \sum_{i=1}^n w_i a_i$
   - $B = \beta + \sum_{i=1}^n w_i b_i$
   - $C = \gamma + \sum_{i=1}^n w_i c_i$

## 4. 实际例子分析

### 4.1 输入数据
```json
{
    "artworkData": "Test Artwork #1",
    "artworkHash": "0x3785fe7e2b81f3ab40cb173578ac0e19d60a2c9a1e1d75f3a3b1b97ead970dc8",
    "signature": "0xdb9b3e50ea70ea1d1dd7fe5ee7dc31d32497c230f8789a1ef879bc5591f2bf2c385992caf9aff08c8ac3f46f538ad116f6ffe09889aaee97220f1da70aa67ded1c",
    "ownerAddress": "0xeD2D8F4F24B11fE89D78e2caaa1d5a04FAAe9ddE"
}
```

### 4.2 证明生成
1. 将输入转换为有限域元素：
   - $sigHash = \text{field}(signature)$
   - $artHash = \text{field}(artworkHash)$

2. 计算承诺：
   - $commitment = \text{Poseidon}(sigHash, artHash)$
   - 结果：$21867235273459337049288948768937623371532292306414755940103345766722373933188$

3. 生成证明：
   - $\pi_a = [4153463000012424745480168515623158462989351670709766161804087700924827407732, ...]$
   - $\pi_b = [[17761888401940317417559402370707006931048533308902782610153993963159898372412, ...], ...]$
   - $\pi_c = [17799937086869158947344253514160077634761864245425647714291781120894983811209, ...]$

### 4.3 验证过程
1. 验证者收到：
   - 证明 $\pi$
   - 公共信号 $[commitment]$
   - 声称的所有者地址

2. 验证步骤：
   - 检查证明格式：$\pi$ 是否包含有效的 $\pi_a, \pi_b, \pi_c$
   - 验证证明：$e(\pi_a, \pi_b) = e(\pi_c, g) \cdot e(commitment, h)$
   - 检查地址：$addr == ownerAddress$

3. 验证结果：
```json
{
    "isValid": true,    // 证明有效
    "isOwner": true     // 地址匹配
}
```

## 5. 安全性和隐私性分析

### 5.1 零知识性
- 证明 $\pi$ 不泄露 $sigHash$ 和 $artHash$
- 验证者只能知道承诺值 $commitment$
- 无法从证明中恢复原始数据

### 5.2 完整性
- 只有知道正确的 $sigHash$ 和 $artHash$ 才能生成有效证明
- 伪造证明在计算上是不可行的
- 承诺值 $commitment$ 绑定到特定的输入对

### 5.3 实用性
- 证明大小固定，与输入大小无关
- 验证时间恒定，适合区块链环境
- 可以用于证明艺术品所有权而不泄露具体内容 