pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/poseidon.circom";

template Ownership() {
    signal input sigHash;      // 消息签名的哈希
    signal input artHash;      // 艺术品的哈希
    signal input nonce;        // 随机数
    signal input validUntil;   // 有效期时间戳
    signal input currentTime;  // 当前时间戳

    signal output commitment;  // 生成的承诺
    signal output isValid;     // 是否有效

    // Poseidon 哈希计算
    component hash = Poseidon(3);
    hash.inputs[0] <== sigHash;
    hash.inputs[1] <== artHash;
    hash.inputs[2] <== nonce;

    commitment <== hash.out;

    // 检查 validUntil 是否大于 currentTime，确保 proof 没有过期
    isValid <-- validUntil > currentTime ? 1 : 0;
    isValid === 1;
}

component main = Ownership();
