pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/poseidon.circom";

template Ownership() {
    signal input sigHash;      
    signal input artHash;      
    signal output commitment;

    component hash = Poseidon(2);
    hash.inputs[0] <== sigHash;
    hash.inputs[1] <== artHash;

    commitment <== hash.out;
}

component main = Ownership();
