export interface Goal {
  id: string;                   
  name: string;                 
  targetAmount: number;         
  currentAmount: number;        
  targetDate: string;           
  priority: GoalPriority;      
  category: GoalCategory;      
  autoDeduct: boolean;         
  autoDeductAmount?: number;   
  autoDeductFrequency?: 'per-paycheck' | 'weekly' | 'monthly';
  notes?: string;               
  completed: boolean;          
  completedDate?: string;      
  createdAt: string;
  updatedAt?: string;
}

export type GoalPriority = 'low' | 'medium' | 'high' | 'critical';
export type GoalCategory = 
  | 'emergency-fund'
  | 'retirement'
  | 'vacation'
  | 'education'
  | 'vehicle'
  | 'home'
  | 'debt-payment'
  | 'investment'
  | 'other';

// Goal progress tracking
export interface GoalProgress {
  goal: Goal;
  progressPercentage: number;   
  amountRemaining: number;
  dailyAmountNeeded: number;    
  projectedDate: string;        
  status: 'on-track' | 'behind' | 'ahead';
}

export const GOAL_CATEGORIES: Record<GoalCategory, { name: string; icon: string; color: string }> = {
  'emergency-fund': { name: 'Emergency Fund', icon: 'emergency', color: '#ff6b6b' },
  'retirement': { name: 'Retirement', icon: 'elderly', color: '#4ecdc4' },
  'vacation': { name: 'Vacation', icon: 'beach_access', color: '#45b7d1' },
  'education': { name: 'Education', icon: 'school', color: '#f9ca24' },
  'vehicle': { name: 'Vehicle', icon: 'directions_car', color: '#6c5ce7' },
  'home': { name: 'Home', icon: 'home', color: '#a29bfe' },
  'debt-payment': { name: 'Debt Payment', icon: 'credit_card_off', color: '#fd79a8' },
  'investment': { name: 'Investment', icon: 'trending_up', color: '#00b894' },
  'other': { name: 'Other', icon: 'category', color: '#636e72' }
};