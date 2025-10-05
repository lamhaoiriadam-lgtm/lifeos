
"use client";

import { useEffect, useState } from 'react';
import './TransactionSuccessAnimation.css';
import { cn } from '@/lib/utils';
import type { Transaction } from '@/lib/types';

interface TransactionSuccessAnimationProps {
    transaction: Transaction | null;
    onAnimationComplete: () => void;
}

export default function TransactionSuccessAnimation({ transaction, onAnimationComplete }: TransactionSuccessAnimationProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (transaction) {
            setIsVisible(true);
            // Trigger animation class after a short delay
            const aTimer = setTimeout(() => setIsAnimating(true), 100);
            // Hide component after animation duration
            const hTimer = setTimeout(() => {
                setIsVisible(false);
                setIsAnimating(false);
                onAnimationComplete();
            }, 3000); // Animation duration + delay

            return () => {
                clearTimeout(aTimer);
                clearTimeout(hTimer);
            }
        }
    }, [transaction, onAnimationComplete]);

    if (!isVisible || !transaction) return null;

    const isIncome = transaction.type === 'income';

    return (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
            <div className={cn("transaction-success-container", isAnimating && "animate")}>
                <div className="left-side" style={{ backgroundColor: isIncome ? '#5de2a3' : '#e25d5d' }}>
                    <div className="card">
                        <div className="card-line" style={{ backgroundColor: isIncome ? '#80ea69' : '#ea6969' }}></div>
                        <div className="buttons" style={{ backgroundColor: isIncome ? '#379e1f' : '#9e1f1f', boxShadow: isIncome ? '0 -10px 0 0 #26850e, 0 10px 0 0 #56be3e' : '0 -10px 0 0 #850e0e, 0 10px 0 0 #be3e3e' }}></div>
                    </div>
                    <div className="post">
                        <div className="post-line"></div>
                        <div className="screen">
                            <div className="dollar" style={{ color: isIncome ? '#4b953b' : '#953b3b' }}>
                                {isIncome ? '+' : '-'}${transaction.amount.toFixed(2)}
                            </div>
                        </div>
                        <div className="numbers"></div>
                        <div className="numbers-line2"></div>
                    </div>
                </div>
                <div className="right-side">
                    <div className="new">Transaction Complete</div>
                </div>
            </div>
        </div>
    );
}
