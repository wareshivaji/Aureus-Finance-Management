import { Component, AfterViewInit, inject, OnDestroy, computed } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { DataStoreService } from 'src/app/core/services/data-store.service';
import { CalculationsService } from 'src/app/core/services/calculations.service';

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.css']
})
export class AnalysisComponent implements AfterViewInit, OnDestroy {
  private dataStore = inject(DataStoreService);
  private calculationsService = inject(CalculationsService);

  // Public computed properties for template access
  financialSummary = computed(() => this.calculationsService.financialSummary());
  savingsRate = computed(() => this.financialSummary().savingsRate);
  cashFlow = computed(() => this.financialSummary().cashFlow);

  spendingChart: any;
  incomeExpenseChart: any;
  trendsChart: any;
  cashFlowChart: any;

  ngAfterViewInit(): void {
    this.updateCharts();
  }

  ngOnDestroy(): void {
    this.destroyCharts();
  }

  private destroyCharts() {
    const charts = [this.spendingChart, this.incomeExpenseChart, this.trendsChart, this.cashFlowChart];
    charts.forEach(chart => {
      if (chart) {
        chart.destroy();
      }
    });
  }

  updateCharts(): void {
    this.destroyCharts();
    this.createSpendingChart();
    this.createIncomeExpenseChart();
    this.createTrendsChart();
    this.createCashFlowChart();
  }

  createSpendingChart(): void {
    const spendingData = this.calculationsService.spendingByCategory();
    
    if (spendingData.length > 0) {
      this.spendingChart = new Chart('spendingChart', {
        type: 'pie',
        data: {
          labels: spendingData.map(item => item.category),
          datasets: [{
            data: spendingData.map(item => item.amount),
            backgroundColor: [
              '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
              '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF',
              '#FF6384', '#36A2EB'
            ]
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'bottom' },
            title: {
              display: true,
              text: 'Spending by Category'
            }
          }
        }
      });
    }
  }

  createIncomeExpenseChart(): void {
    const summary = this.calculationsService.financialSummary();
    
    this.incomeExpenseChart = new Chart('incomeExpenseChart', {
      type: 'bar',
      data: {
        labels: ['Current Month'],
        datasets: [
          {
            label: 'Income',
            data: [summary.totalIncome],
            backgroundColor: '#4CAF50'
          },
          {
            label: 'Expenses',
            data: [summary.totalExpenses],
            backgroundColor: '#F44336'
          },
          {
            label: 'Net Balance',
            data: [summary.netWorth],
            backgroundColor: '#2196F3'
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: {
            display: true,
            text: 'Income vs Expenses vs Net Balance'
          }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  createTrendsChart(): void {
    const summary = this.calculationsService.financialSummary();
    const netWorth = summary.netWorth;
    
    this.trendsChart = new Chart('trendsChart', {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Current Balance',
            data: [2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000, 6500, 7000, netWorth],
            borderColor: '#2196F3',
            backgroundColor: 'rgba(33, 150, 243, 0.1)',
            fill: true,
            tension: 0.4
          },
          {
            label: 'Total Income',
            data: [3000, 3200, 3500, 3800, 4000, 4200, 4500, 4800, 5000, 5200, 5500, summary.totalIncome],
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            fill: true,
            tension: 0.4
          },
          {
            label: 'Total Expenses',
            data: [1000, 1200, 1500, 1800, 2000, 2200, 2500, 2800, 3000, 3200, 3500, summary.totalExpenses],
            borderColor: '#F44336',
            backgroundColor: 'rgba(244, 67, 54, 0.1)',
            fill: true,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: {
            display: true,
            text: 'Monthly Financial Trends'
          }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  createCashFlowChart(): void {
    const summary = this.calculationsService.financialSummary();
    
    this.cashFlowChart = new Chart('cashFlowChart', {
      type: 'doughnut',
      data: {
        labels: ['Income', 'Expenses', 'Net'],
        datasets: [{
          data: [summary.totalIncome, summary.totalExpenses, summary.netWorth],
          backgroundColor: ['#4CAF50', '#F44336', '#2196F3']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          title: {
            display: true,
            text: 'Cash Flow Distribution'
          }
        }
      }
    });
  }

  exportData(format: string) {
    const transactions = this.dataStore.transactions$();
    const budgets = this.dataStore.budgets$();
    const goals = this.dataStore.goals$();
    
    const data = {
      transactions,
      budgets,
      goals,
      generated: new Date().toISOString()
    };
    
    if (format === 'csv') {
      this.exportToCSV(data);
    } else if (format === 'pdf') {
      this.exportToPDF(data);
    }
  }

  private exportToCSV(data: any): void {
    let csvContent = 'Data,Value\n';
    
    data.transactions.forEach((t: any) => {
      csvContent += `Transaction: ${t.category},${t.amount}\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `financial-data-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  }

  private exportToPDF(data: any): void {
    alert("PDF export would be implemented with a library like jsPDF");
  }
}