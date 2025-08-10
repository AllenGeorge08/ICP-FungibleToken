import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Result "mo:base/Result";
import Principal "mo:base/Principal";

actor Token {
    // Token info
    private let name = "NeonCoin";
    private let symbol = "NEON";
    private let creator = Principal.fromText("ud2uu-gpjc4-a7y2f-qp2bu-7yp56-lqpen-ngv6i-uif2h-4tm6j-v5w2o-cqe");
    
    // Storage
    private var totalSupply : Nat = 1000000; // 1 million initial supply
    private var balances = HashMap.HashMap<Principal, Nat>(0, Principal.equal, Principal.hash);
    
    // Initialize creator balance
    private func init() {
        balances.put(creator, totalSupply);
    };
    
    // Call init when contract starts
    init();
    
    // Get token info
    public query func tokenInfo() : async {name: Text; symbol: Text; totalSupply: Nat} {
        {name = name; symbol = symbol; totalSupply = totalSupply}
    };
    
    // Get balance
    public query func balanceOf(user: Principal) : async Nat {
        switch (balances.get(user)) {
            case null { 0 };
            case (?balance) { balance };
        }
    };
    
    // Transfer tokens
    public func transfer(to: Principal, amount: Nat) : async Result.Result<Text, Text> {
        let caller = Principal.fromText("ud2uu-gpjc4-a7y2f-qp2bu-7yp56-lqpen-ngv6i-uif2h-4tm6j-v5w2o-cqe");
        let fromBalance = switch (balances.get(caller)) {
            case null { 0 };
            case (?balance) { balance };
        };
        
        if (fromBalance < amount) {
            return #err("Insufficient balance");
        };
        
        // Update sender balance
        balances.put(caller, fromBalance - amount);
        
        // Update receiver balance
        let toBalance = switch (balances.get(to)) {
            case null { 0 };
            case (?balance) { balance };
        };
        balances.put(to, toBalance + amount);
        
        #ok("Transfer successful")
    };
    
    // Mint tokens (only creator)
    public func mint(to: Principal, amount: Nat) : async Result.Result<Text, Text> {
        let caller = Principal.fromText("ud2uu-gpjc4-a7y2f-qp2bu-7yp56-lqpen-ngv6i-uif2h-4tm6j-v5w2o-cqe");
        
        if (caller != creator) {
            return #err("Only creator can mint");
        };
        
        // Update total supply
        totalSupply += amount;
        
        // Update recipient balance
        let currentBalance = switch (balances.get(to)) {
            case null { 0 };
            case (?balance) { balance };
        };
        balances.put(to, currentBalance + amount);
        
        #ok("Tokens minted successfully")
    };
    
    // Get total supply
    public query func getTotalSupply() : async Nat {
        totalSupply
    };
}