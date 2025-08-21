export interface Budget {
  id: string;                   
  category: string;             
  amount: number;               
  period: BudgetPeriod;         
  type: 'category' | 'overall'; 
  startDate: string;            
  endDate?: string;             
  rollover: boolean;            
  alerts: BudgetAlert[];        
  createdAt: string;
  updatedAt?: string;
}

export type BudgetPeriod = 
  | 'daily'
  | 'weekly' 
  | 'bi-weekly'
  | 'monthly'
  | 'quarterly'
  | 'yearly';

export interface BudgetAlert {
  type: 'percentage' | 'amount';
  threshold: number;            
  triggered: boolean;           
  lastTriggered?: string;       
}

// Budget progress tracking
export interface BudgetProgress {
  budget: Budget;
  spent: number;
  remaining: number;
  percentage: number;           
  status: 'on-track' | 'warning' | 'exceeded';
  daysRemaining: number;        
}