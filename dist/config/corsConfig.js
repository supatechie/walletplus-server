"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allowedDomains = void 0;
const allowedDomains = () => {
    if (process.env.NODE_ENV === "production") {
        return ["https://supawalletplus.herokuapp.com", 'https://api-supawalletplus.herokuapp.com', "api-supawalletplus.herokuapp.com"];
    }
    return ["http://localhost:3000", 'localhost'];
};
exports.allowedDomains = allowedDomains;
