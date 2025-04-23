#!/bin/bash

# 设置错误时退出
set -e

echo "开始编译电路..."

# 1. 编译电路
echo "编译 author_proof.circom..."
circom circom/author_proof.circom --wasm --r1cs -o ./circom

# 2. 生成 zkey 文件
echo "生成 zkey 文件..."
snarkjs groth16 setup ./circom/author_proof.r1cs ./circom/powersOfTau28_hez_final_15.ptau ./circom/author_proof.zkey

# 3. 导出验证密钥
echo "导出验证密钥..."
snarkjs zkey export verificationkey ./circom/author_proof.zkey ./circom/verification_key.json

echo "编译完成！"
echo "生成的文件："
echo "- author_proof.r1cs"
echo "- author_proof_js/author_proof.wasm"
echo "- author_proof.zkey"
echo "- verification_key.json" 