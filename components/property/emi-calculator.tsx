"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface EmiCalculatorProps {
    price?: number
}

export function EmiCalculator({ price }: EmiCalculatorProps) {
    const [loanAmount, setLoanAmount] = useState(price ? price * 0.8 : 5000000)
    const [interestRate, setInterestRate] = useState(8.5)
    const [tenure, setTenure] = useState(20)

    // Simple EMI calculation: P * r * (1 + r)^n / ((1 + r)^n - 1)
    const calculateEMI = () => {
        const r = interestRate / 12 / 100
        const n = tenure * 12
        const emi = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
        return Math.round(emi).toLocaleString('en-IN')
    }

    return (
        <div className="bg-white rounded-3xl p-8 border border-slate-100">
            <h3 className="text-xl font-semibold mb-6">EMI Calculator</h3>

            <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-8">
                    {/* Loan Amount */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label className="text-slate-500">Loan Amount</Label>
                            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                                <span className="text-slate-400">₹</span>
                                <input
                                    type="number"
                                    value={loanAmount}
                                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                                    className="bg-transparent w-24 text-right font-medium outline-none"
                                />
                            </div>
                        </div>
                        <input
                            type="range"
                            min="100000"
                            max="50000000"
                            step="100000"
                            value={loanAmount}
                            onChange={(e) => setLoanAmount(Number(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                        <div className="flex justify-between text-xs text-slate-400">
                            <span>₹1 Lac</span>
                            <span>₹5 Cr</span>
                        </div>
                    </div>

                    {/* Interest Rate */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label className="text-slate-500">Interest Rate (%)</Label>
                            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                                <input
                                    type="number"
                                    value={interestRate}
                                    onChange={(e) => setInterestRate(Number(e.target.value))}
                                    className="bg-transparent w-12 text-right font-medium outline-none"
                                />
                                <span className="text-slate-400">%</span>
                            </div>
                        </div>
                        <input
                            type="range"
                            min="5"
                            max="18"
                            step="0.1"
                            value={interestRate}
                            onChange={(e) => setInterestRate(Number(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                        <div className="flex justify-between text-xs text-slate-400">
                            <span>5%</span>
                            <span>18%</span>
                        </div>
                    </div>

                    {/* Tenure */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label className="text-slate-500">Loan Tenure (Years)</Label>
                            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                                <input
                                    type="number"
                                    value={tenure}
                                    onChange={(e) => setTenure(Number(e.target.value))}
                                    className="bg-transparent w-12 text-right font-medium outline-none"
                                />
                                <span className="text-slate-400">Yr</span>
                            </div>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="30"
                            step="1"
                            value={tenure}
                            onChange={(e) => setTenure(Number(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                        <div className="flex justify-between text-xs text-slate-400">
                            <span>1 Yr</span>
                            <span>30 Yrs</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-center items-center bg-slate-50 rounded-2xl p-8 border border-slate-200/50">
                    <p className="text-slate-500 font-medium mb-2">Monthly EMI</p>
                    <h2 className="text-4xl font-bold text-slate-900 mb-6">₹{calculateEMI()}</h2>

                    <div className="w-full space-y-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Principal Amount</span>
                            <span className="font-medium">₹{loanAmount.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Total Interest</span>
                            <span className="font-medium">₹{Math.round((Number(calculateEMI().replace(/,/g, '')) * tenure * 12) - loanAmount).toLocaleString('en-IN')}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-900 font-semibold">Total Amount Payable</span>
                            <span className="font-bold text-indigo-600">₹{Math.round(Number(calculateEMI().replace(/,/g, '')) * tenure * 12).toLocaleString('en-IN')}</span>
                        </div>
                    </div>

                    <Button variant="outline" className="w-full mt-8 border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                        Check Eligibility
                    </Button>
                </div>
            </div>
        </div>
    )
}
