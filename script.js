// ETF Competition Application - Multi-Week Analysis
class ETFCompetitionAnalyzer {
    constructor() {
        // All weeks data based on the provided performance tables
        this.weeksData = {
            week1: {
                title: "Week 1: June 23-27, 2025",
                dateRange: "Jun 23-27",
                totalInvestment: 1000000,
                totalFinalValue: 1036363.50,
                totalGain: 36363.50,
                investments: {
                    VOO: { 
                        amount: 450000, 
                        openPrice: 548.66, 
                        closePrice: 566.95,
                        gainPercent: 3.33,
                        finalValue: 465001.09,
                        name: "Vanguard S&P 500 ETF"
                    },
                    HACK: { 
                        amount: 300000, 
                        openPrice: 82.52, 
                        closePrice: 85.20,
                        gainPercent: 3.25,
                        finalValue: 309743.09,
                        name: "Amplify Cybersecurity ETF"
                    },
                    EIS: { 
                        amount: 250000, 
                        openPrice: 88.00, 
                        closePrice: 92.09,
                        gainPercent: 4.65,
                        finalValue: 261619.32,
                        name: "iShares MSCI Israel ETF"
                    }
                },
                actualPrices: {
                    VOO: [553.36, 559.44, 563.70, 566.95],
                    HACK: [84.15, 84.45, 85.00, 85.20],
                    EIS: [89.34, 91.74, 92.07, 92.09]
                }
            },
            week2: {
                title: "Week 2: June 30-July 3, 2025",
                dateRange: "Jun 30-Jul 3",
                totalInvestment: 1000000,
                totalFinalValue: 1004616.34,
                totalGain: 4616.34,
                investments: {
                    QQQ: { 
                        amount: 500000, 
                        openPrice: 551.26, 
                        closePrice: 556.22,
                        gainPercent: 0.90,
                        finalValue: 504498.78,
                        name: "Invesco QQQ Trust"
                    },
                    IBIT: { 
                        amount: 300000, 
                        openPrice: 61.27, 
                        closePrice: 62.19,
                        gainPercent: 1.50,
                        finalValue: 304504.65,
                        name: "iShares Bitcoin Trust ETF"
                    },
                    URA: { 
                        amount: 200000, 
                        openPrice: 38.75, 
                        closePrice: 37.90,
                        gainPercent: -2.19,
                        finalValue: 195612.90,
                        name: "Global X Uranium ETF"
                    }
                },
                actualPrices: {
                    QQQ: [551.64, 546.99, 550.80, 556.22],
                    IBIT: [61.21, 59.84, 62.42, 62.19],
                    URA: [38.61, 37.42, 37.71, 37.90]
                }
            },
            week3: {
                title: "Week 3: July 8-11, 2025",
                dateRange: "Jul 8-11",
                totalInvestment: 1000000,
                totalFinalValue: 1005356.83,
                totalGain: 5356.83,
                investments: {
                    BLCN: { 
                        amount: 400000, 
                        openPrice: 24.01, 
                        closePrice: 24.53,
                        gainPercent: 2.17,
                        finalValue: 408663.06,
                        name: "Siren Nasdaq NexGen Economy ETF"
                    },
                    IYW: { 
                        amount: 300000, 
                        openPrice: 175.01, 
                        closePrice: 175.08,
                        gainPercent: 0.04,
                        finalValue: 300119.99,
                        name: "iShares U.S. Technology ETF"
                    },
                    AIQ: { 
                        amount: 300000, 
                        openPrice: 43.78, 
                        closePrice: 43.28,
                        gainPercent: -1.14,
                        finalValue: 296573.78,
                        name: "Global X Artificial Intelligence & Technology ETF"
                    }
                },
                actualPrices: {
                    BLCN: [24.36, 24.35, 24.45, 24.53],
                    IYW: [174.87, 176.30, 175.72, 175.08],
                    AIQ: [43.68, 43.77, 43.65, 43.28]
                }
            },
            week4: {
                title: "Week 4: July 15-18, 2025",
                dateRange: "Jul 15-18",
                totalInvestment: 1000000,
                totalFinalValue: 1015127.24,
                totalGain: 15127.24,
                investments: {
                    BLCN: { 
                        amount: 400000, 
                        openPrice: 24.86, 
                        closePrice: 25.51,
                        gainPercent: 2.61,
                        finalValue: 410458.57,
                        name: "Siren Nasdaq NexGen Economy ETF"
                    },
                    IYW: { 
                        amount: 300000, 
                        openPrice: 177.33, 
                        closePrice: 178.72,
                        gainPercent: 0.78,
                        finalValue: 302351.55,
                        name: "iShares U.S. Technology ETF"
                    },
                    AIQ: { 
                        amount: 300000, 
                        openPrice: 44.02, 
                        closePrice: 44.36,
                        gainPercent: 0.77,
                        finalValue: 302317.13,
                        name: "Global X Artificial Intelligence & Technology ETF"
                    }
                },
                actualPrices: {
                    BLCN: [24.58, 24.80, 25.30, 25.51],
                    IYW: [176.77, 177.14, 178.69, 178.72],
                    AIQ: [43.79, 43.98, 44.43, 44.36]
                }
            }
        };

        this.dates = ['Day 1', 'Day 2', 'Day 3', 'Day 4'];
        this.currentWeek = null;
        this.currentCharts = {};
        
        this.init();
    }

    init() {
        this.setupNavigation();
        this.generateWeekPages();
    }

    setupNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        const pageContents = document.querySelectorAll('.page-content');

        navButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetPage = button.getAttribute('data-page');
                
                // Remove active class from all buttons and pages
                navButtons.forEach(btn => btn.classList.remove('active'));
                pageContents.forEach(page => page.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Show target page
                const targetPageElement = document.getElementById(`${targetPage}-page`);
                if (targetPageElement) {
                    targetPageElement.classList.add('active');
                    
                    // If it's a week page, load the week data
                    if (targetPage.startsWith('week')) {
                        this.loadWeekData(targetPage);
                    }
                }
            });
        });
    }

    generateWeekPages() {
        // Generate content for each week
        Object.keys(this.weeksData).forEach(weekKey => {
            const weekData = this.weeksData[weekKey];
            const pageElement = document.getElementById(`${weekKey}-content`);
            
            if (pageElement) {
                pageElement.innerHTML = this.generateWeekHTML(weekKey, weekData);
            }
        });
    }

    generateWeekHTML(weekKey, weekData) {
        const etfKeys = Object.keys(weekData.investments);
        
        return `
            <div class="week-header">
                <h2>${weekData.title}</h2>
                <div class="week-stats">
                    <span>Total Investment: $${weekData.totalInvestment.toLocaleString()}</span>
                    <span>Final Value: $${weekData.totalFinalValue.toLocaleString()}</span>
                    <span class="week-gain ${weekData.totalGain >= 0 ? 'positive' : 'negative'}">
                        ${weekData.totalGain >= 0 ? '+' : ''}$${Math.abs(weekData.totalGain).toLocaleString()}
                    </span>
                </div>
            </div>

            <section class="portfolio-summary">
                <h3>Week ${weekKey.slice(-1)} Performance Overview</h3>
                <div class="summary-cards">
                    <div class="summary-card total-return">
                        <h4>Total Portfolio Return</h4>
                        <div class="return-value">${this.formatCurrency(weekData.totalGain)}</div>
                        <div class="return-percentage">${this.formatPercentage((weekData.totalGain / weekData.totalInvestment) * 100)}</div>
                    </div>
                    <div class="summary-card best-performer">
                        <h4>Best Performer</h4>
                        <div class="performer-etf" id="${weekKey}-bestPerformer">-</div>
                        <div class="performer-return" id="${weekKey}-bestPerformerReturn">-</div>
                    </div>
                    <div class="summary-card worst-performer">
                        <h4>Worst Performer</h4>
                        <div class="performer-etf" id="${weekKey}-worstPerformer">-</div>
                        <div class="performer-return" id="${weekKey}-worstPerformerReturn">-</div>
                    </div>
                </div>
            </section>

            <section class="portfolio-chart">
                <h3>Portfolio Performance Timeline</h3>
                <div class="chart-container">
                    <canvas id="${weekKey}-portfolioChart"></canvas>
                </div>
            </section>

            <section class="etf-navigation">
                <h3>Individual ETF Analysis</h3>
                <div class="nav-buttons">
                    <button class="nav-btn active" data-etf="overview" data-week="${weekKey}">Portfolio Overview</button>
                    ${etfKeys.map(etf => `
                        <button class="nav-btn" data-etf="${etf.toLowerCase()}" data-week="${weekKey}">
                            ${etf} - ${weekData.investments[etf].name.split(' ').slice(-1)[0]} ($${(weekData.investments[etf].amount/1000).toFixed(0)}K)
                        </button>
                    `).join('')}
                </div>
            </section>

            <section class="etf-content">
                <div class="etf-section active" id="${weekKey}-overview-section">
                    <div class="overview-content">
                        <h4>Investment Summary</h4>
                        <div class="investment-grid">
                            ${etfKeys.map(etf => {
                                const investment = weekData.investments[etf];
                                const returnAmount = investment.finalValue - investment.amount;
                                return `
                                    <div class="investment-item">
                                        <h5>${etf} - ${investment.name}</h5>
                                        <p><strong>Investment:</strong> $${investment.amount.toLocaleString()}</p>
                                        <p><strong>Performance:</strong> 
                                            <span class="performance-value ${returnAmount >= 0 ? 'positive' : 'negative'}">
                                                ${this.formatCurrency(returnAmount)} (${this.formatPercentage(investment.gainPercent)})
                                            </span>
                                        </p>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                        <div class="market-summary">
                            <h4>Week Analysis</h4>
                            <div id="${weekKey}-weekAnalysis">Loading analysis...</div>
                        </div>
                    </div>
                </div>

                ${etfKeys.map(etf => `
                    <div class="etf-section" id="${weekKey}-${etf.toLowerCase()}-section">
                        <div class="etf-header">
                            <h4>${etf} - ${weekData.investments[etf].name}</h4>
                            <div class="investment-amount">Investment: $${weekData.investments[etf].amount.toLocaleString()}</div>
                        </div>
                        <div class="etf-content-grid">
                            <div class="etf-chart-container">
                                <canvas id="${weekKey}-${etf.toLowerCase()}Chart"></canvas>
                            </div>
                            <div class="etf-metrics">
                                <div class="performance-metrics">
                                    <div class="metric">
                                        <span class="metric-label">Return:</span>
                                        <span class="metric-value ${(weekData.investments[etf].finalValue - weekData.investments[etf].amount) >= 0 ? 'positive' : 'negative'}">
                                            ${this.formatCurrency(weekData.investments[etf].finalValue - weekData.investments[etf].amount)}
                                        </span>
                                    </div>
                                    <div class="metric">
                                        <span class="metric-label">Percentage:</span>
                                        <span class="metric-value ${weekData.investments[etf].gainPercent >= 0 ? 'positive' : 'negative'}">
                                            ${this.formatPercentage(weekData.investments[etf].gainPercent)}
                                        </span>
                                    </div>
                                    <div class="metric">
                                        <span class="metric-label">Final Value:</span>
                                        <span class="metric-value">${this.formatCurrency(weekData.investments[etf].finalValue)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="analysis" id="${weekKey}-${etf.toLowerCase()}Analysis">
                            <h5>Performance Analysis</h5>
                            <p>Loading detailed analysis...</p>
                        </div>
                    </div>
                `).join('')}
            </section>
        `;
    }

    loadWeekData(weekKey) {
        const weekData = this.weeksData[weekKey];
        if (!weekData) return;

        this.currentWeek = weekKey;
        
        // Clear existing charts
        Object.values(this.currentCharts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        this.currentCharts = {};

        // Set up week-specific navigation
        setTimeout(() => {
            this.setupWeekNavigation(weekKey);
            this.updateWeekSummary(weekKey, weekData);
            this.createWeekCharts(weekKey, weekData);
            this.generateWeekAnalysis(weekKey, weekData);
        }, 100);
    }

    setupWeekNavigation(weekKey) {
        const weekNavButtons = document.querySelectorAll(`[data-week="${weekKey}"]`);
        const weekSections = document.querySelectorAll(`#${weekKey}-page .etf-section`);

        weekNavButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetEtf = button.getAttribute('data-etf');
                
                // Remove active class from week nav buttons
                weekNavButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Hide all week sections
                weekSections.forEach(section => section.classList.remove('active'));
                
                // Show target section
                const targetSection = document.getElementById(`${weekKey}-${targetEtf}-section`);
                if (targetSection) {
                    targetSection.classList.add('active');
                }
            });
        });
    }

    updateWeekSummary(weekKey, weekData) {
        const etfPerformances = Object.entries(weekData.investments).map(([etf, data]) => ({
            etf,
            returnPercentage: data.gainPercent
        }));

        // Sort by performance
        etfPerformances.sort((a, b) => b.returnPercentage - a.returnPercentage);

        const bestPerformer = etfPerformances[0];
        const worstPerformer = etfPerformances[etfPerformances.length - 1];

        // Update best/worst performer displays
        const bestElement = document.getElementById(`${weekKey}-bestPerformer`);
        const bestReturnElement = document.getElementById(`${weekKey}-bestPerformerReturn`);
        const worstElement = document.getElementById(`${weekKey}-worstPerformer`);
        const worstReturnElement = document.getElementById(`${weekKey}-worstPerformerReturn`);

        if (bestElement && bestReturnElement) {
            bestElement.textContent = bestPerformer.etf;
            bestReturnElement.textContent = this.formatPercentage(bestPerformer.returnPercentage);
        }

        if (worstElement && worstReturnElement) {
            worstElement.textContent = worstPerformer.etf;
            worstReturnElement.textContent = this.formatPercentage(worstPerformer.returnPercentage);
        }
    }

    createWeekCharts(weekKey, weekData) {
        this.createWeekPortfolioChart(weekKey, weekData);
        this.createWeekETFCharts(weekKey, weekData);
    }

    createWeekPortfolioChart(weekKey, weekData) {
        const ctx = document.getElementById(`${weekKey}-portfolioChart`);
        if (!ctx) return;

        const portfolioValues = this.dates.map((date, index) => {
            let totalValue = 0;
            Object.keys(weekData.investments).forEach(etf => {
                const investment = weekData.investments[etf];
                const shares = investment.amount / investment.openPrice;
                const price = weekData.actualPrices[etf][index];
                totalValue += shares * price;
            });
            return totalValue;
        });

        // Create gradient
        const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(102, 126, 234, 0.3)');
        gradient.addColorStop(0.5, 'rgba(102, 126, 234, 0.1)');
        gradient.addColorStop(1, 'rgba(102, 126, 234, 0.02)');

        this.currentCharts[`${weekKey}-portfolio`] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.dates,
                datasets: [{
                    label: 'Total Portfolio Value',
                    data: portfolioValues,
                    borderColor: '#667eea',
                    backgroundColor: gradient,
                    borderWidth: 4,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#667eea',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 3,
                    pointRadius: 8,
                    pointHoverRadius: 12
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: `${weekData.title} Portfolio Performance`,
                        font: { size: 18, weight: '700', family: 'Inter' },
                        color: '#2c3e50',
                        padding: 20
                    },
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#2c3e50',
                        bodyColor: '#5a6c7d',
                        borderColor: '#667eea',
                        borderWidth: 2,
                        cornerRadius: 10,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return 'Portfolio Value: $' + context.parsed.y.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: function(value) {
                                return '$' + (value / 1000).toFixed(0) + 'K';
                            },
                            color: '#5a6c7d'
                        },
                        grid: { color: 'rgba(0, 0, 0, 0.08)', drawBorder: false }
                    },
                    x: {
                        ticks: { color: '#5a6c7d' },
                        grid: { color: 'rgba(0, 0, 0, 0.08)', drawBorder: false }
                    }
                }
            }
        });
    }

    createWeekETFCharts(weekKey, weekData) {
        const colors = {
            VOO: { primary: '#2ecc71', gradient: ['rgba(46, 204, 113, 0.3)', 'rgba(46, 204, 113, 0.1)', 'rgba(46, 204, 113, 0.02)'] },
            HACK: { primary: '#e74c3c', gradient: ['rgba(231, 76, 60, 0.3)', 'rgba(231, 76, 60, 0.1)', 'rgba(231, 76, 60, 0.02)'] },
            EIS: { primary: '#3498db', gradient: ['rgba(52, 152, 219, 0.3)', 'rgba(52, 152, 219, 0.1)', 'rgba(52, 152, 219, 0.02)'] },
            QQQ: { primary: '#9b59b6', gradient: ['rgba(155, 89, 182, 0.3)', 'rgba(155, 89, 182, 0.1)', 'rgba(155, 89, 182, 0.02)'] },
            IBIT: { primary: '#f39c12', gradient: ['rgba(243, 156, 18, 0.3)', 'rgba(243, 156, 18, 0.1)', 'rgba(243, 156, 18, 0.02)'] },
            URA: { primary: '#1abc9c', gradient: ['rgba(26, 188, 156, 0.3)', 'rgba(26, 188, 156, 0.1)', 'rgba(26, 188, 156, 0.02)'] },
            BLCN: { primary: '#e74c3c', gradient: ['rgba(231, 76, 60, 0.3)', 'rgba(231, 76, 60, 0.1)', 'rgba(231, 76, 60, 0.02)'] },
            IYW: { primary: '#2ecc71', gradient: ['rgba(46, 204, 113, 0.3)', 'rgba(46, 204, 113, 0.1)', 'rgba(46, 204, 113, 0.02)'] },
            AIQ: { primary: '#3498db', gradient: ['rgba(52, 152, 219, 0.3)', 'rgba(52, 152, 219, 0.1)', 'rgba(52, 152, 219, 0.02)'] }
        };

        Object.keys(weekData.investments).forEach(etf => {
            const ctx = document.getElementById(`${weekKey}-${etf.toLowerCase()}Chart`);
            if (!ctx) return;

            const prices = weekData.actualPrices[etf];
            const color = colors[etf];

            // Create gradient
            const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 300);
            gradient.addColorStop(0, color.gradient[0]);
            gradient.addColorStop(0.5, color.gradient[1]);
            gradient.addColorStop(1, color.gradient[2]);

            this.currentCharts[`${weekKey}-${etf}`] = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: this.dates,
                    datasets: [{
                        label: `${etf} Price`,
                        data: prices,
                        borderColor: color.primary,
                        backgroundColor: gradient,
                        borderWidth: 4,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: color.primary,
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 3,
                        pointRadius: 7,
                        pointHoverRadius: 10
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        title: {
                            display: true,
                            text: `${etf} Price Movement`,
                            font: { size: 16, weight: '700', family: 'Inter' },
                            color: '#2c3e50'
                        },
                        tooltip: {
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            titleColor: '#2c3e50',
                            bodyColor: '#5a6c7d',
                            borderColor: color.primary,
                            borderWidth: 2,
                            cornerRadius: 8,
                            displayColors: false,
                            callbacks: {
                                label: function(context) {
                                    return `${etf} Price: $${context.parsed.y.toFixed(2)}`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: false,
                            ticks: {
                                callback: function(value) {
                                    return '$' + value.toFixed(2);
                                },
                                color: '#5a6c7d'
                            },
                            grid: { color: 'rgba(0, 0, 0, 0.08)', drawBorder: false }
                        },
                        x: {
                            ticks: { color: '#5a6c7d' },
                            grid: { color: 'rgba(0, 0, 0, 0.08)', drawBorder: false }
                        }
                    }
                }
            });
        });
    }

    generateWeekAnalysis(weekKey, weekData) {
        const analysisElement = document.getElementById(`${weekKey}-weekAnalysis`);
        if (!analysisElement) return;

        const totalReturnPercent = (weekData.totalGain / weekData.totalInvestment) * 100;
        
        let weekAnalysis = '';
        
        switch(weekKey) {
            case 'week1':
                weekAnalysis = `
                    <p>Week 1 delivered exceptional performance with a ${this.formatPercentage(totalReturnPercent)} return, the strongest week of the competition.</p>
                    <ul>
                        <li><strong>EIS:</strong> Led with 4.65% gain - Israel tech sector strength</li>
                        <li><strong>VOO:</strong> Solid 3.33% S&P 500 performance showed broad market momentum</li>
                        <li><strong>HACK:</strong> Cybersecurity sector gained 3.25% on increased demand</li>
                        <li><strong>Strategy Success:</strong> Diversified approach across geographies and sectors paid off</li>
                    </ul>
                `;
                break;
            case 'week2':
                weekAnalysis = `
                    <p>Week 2 showed modest gains with a ${this.formatPercentage(totalReturnPercent)} return, impacted by URA's uranium sector decline.</p>
                    <ul>
                        <li><strong>IBIT:</strong> Bitcoin ETF gained 1.50% as crypto sentiment improved</li>
                        <li><strong>QQQ:</strong> NASDAQ tracking showed 0.90% growth in tech leaders</li>
                        <li><strong>URA:</strong> Uranium sector declined -2.19% on regulatory concerns</li>
                        <li><strong>Learning:</strong> Commodity exposure added volatility to tech-focused strategy</li>
                    </ul>
                `;
                break;
            case 'week3':
                weekAnalysis = `
                    <p>Week 3 generated a ${this.formatPercentage(totalReturnPercent)} return with BLCN leading the tech-focused portfolio.</p>
                    <ul>
                        <li><strong>BLCN:</strong> Blockchain sector gained 2.17% on institutional adoption news</li>
                        <li><strong>IYW:</strong> Broad tech exposure remained flat at 0.04%</li>
                        <li><strong>AIQ:</strong> AI sector declined -1.14% on profit-taking</li>
                        <li><strong>Tech Focus:</strong> Concentration in tech themes showed both opportunity and risk</li>
                    </ul>
                `;
                break;
            case 'week4':
                weekAnalysis = `
                    <p>Week 4 finished strong with a ${this.formatPercentage(totalReturnPercent)} return, second-best performance using the refined tech strategy.</p>
                    <ul>
                        <li><strong>BLCN:</strong> Blockchain continued momentum with 2.61% gain</li>
                        <li><strong>IYW & AIQ:</strong> Both tech ETFs delivered consistent ~0.78% returns</li>
                        <li><strong>Strategy Refinement:</strong> Repeating successful Week 3 picks with better timing</li>
                        <li><strong>Strong Finish:</strong> Demonstrated learning and adaptation throughout competition</li>
                    </ul>
                `;
                break;
        }

        analysisElement.innerHTML = weekAnalysis;

        // Generate individual ETF analysis
        Object.keys(weekData.investments).forEach(etf => {
            const etfAnalysisElement = document.getElementById(`${weekKey}-${etf.toLowerCase()}Analysis`);
            if (etfAnalysisElement) {
                const investment = weekData.investments[etf];
                const returnAmount = investment.finalValue - investment.amount;
                
                etfAnalysisElement.innerHTML = `
                    <h5>Performance Analysis</h5>
                    <p>${etf} ${returnAmount >= 0 ? 'gained' : 'declined'} ${this.formatPercentage(Math.abs(investment.gainPercent))} over the ${weekData.dateRange} period.</p>
                    <ul>
                        <li>Price movement: $${investment.openPrice} → $${investment.closePrice}</li>
                        <li>Investment return: ${this.formatCurrency(returnAmount)}</li>
                        <li>Final position value: ${this.formatCurrency(investment.finalValue)}</li>
                        <li>${this.getETFInsight(etf, investment.gainPercent)}</li>
                    </ul>
                `;
            }
        });
    }

    getETFInsight(etf, gainPercent) {
        const insights = {
            VOO: gainPercent > 0 ? "S&P 500 benefited from broad market optimism and strong corporate earnings" : "Market volatility affected broad index performance",
            HACK: gainPercent > 0 ? "Cybersecurity demand increased amid rising digital threats" : "Sector consolidation and valuation concerns weighed on performance",
            EIS: gainPercent > 0 ? "Israel tech sector showed innovation leadership in global markets" : "Geopolitical factors and regional market conditions impacted performance",
            QQQ: gainPercent > 0 ? "NASDAQ tech leaders drove market performance higher" : "Tech sector rotation and profit-taking affected NASDAQ performance",
            IBIT: gainPercent > 0 ? "Bitcoin institutional adoption supported crypto ETF performance" : "Cryptocurrency volatility and regulatory concerns impacted returns",
            URA: gainPercent > 0 ? "Uranium sector benefited from nuclear energy revival trends" : "Regulatory uncertainty and supply chain issues affected uranium prices",
            BLCN: gainPercent > 0 ? "Blockchain technology adoption by institutions drove sector gains" : "Crypto market volatility and regulatory concerns weighed on blockchain stocks",
            IYW: gainPercent > 0 ? "Technology sector fundamentals supported broad-based gains" : "Tech sector rotation and valuation concerns created headwinds",
            AIQ: gainPercent > 0 ? "AI sector momentum continued with enterprise adoption growth" : "AI bubble concerns and high valuations led to profit-taking"
        };
        
        return insights[etf] || "Market conditions influenced performance during this period";
    }

    formatCurrency(amount) {
        const sign = amount >= 0 ? '+' : '';
        return sign + '$' + Math.abs(amount).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    formatPercentage(percentage) {
        const sign = percentage >= 0 ? '+' : '';
        return sign + percentage.toFixed(2) + '%';
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new ETFCompetitionAnalyzer();
}); 