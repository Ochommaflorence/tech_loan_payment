import { Schema, model } from "mongoose"

const loanSchema = new Schema({
    user_id: {
        type: String,
        required: true,
        ref: "User"
    },
    amount: {
        type: Number,
        required: true,
    },
    period: {
        type: Number,
        default: 1,
        required: true,
    },
    repaidAmount: {
        type: Number,
        default: 0,
    },
    monthlyRepayment: {
        type: Number,
        required: true,
    },
    intrest: {
        type: Number,
        required: true,
    },
    request_date: {
        type: Number,
        required: true,
        default: Date.now()
    },
    status: {
        type: String,
        enum: [ "requested", "approved", "cancelled", "paid"],
        default: "requested"
    },
});

const loanModel = model("loan", loanSchema);


export default loanModel