import { FormBuilder, FormGroup } from '@angular/forms';
import { Chart, ChartConfiguration, ChartData, registerables } from 'chart.js';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { DataService } from '../services/data.service';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-action-summary',
  templateUrl: './action-summary.component.html',
  styleUrls: ['./action-summary.component.scss']
})
export class ActionSummaryComponent implements OnInit, AfterViewInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  form: FormGroup;
  filterOptions: any;
  summary: any;
  activeTab: string = 'followup';
  displayedColumns: string[] = ['select', 'vesselOffice', 'reportType', 'referenceNo', 'action', 'actionDescription', 'raisedOn', 'raisedBy', 'dueDate', 'vesselRespondent'];
  tableData = new MatTableDataSource<any>([]);
  chart: Chart | undefined;

  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalRecords: number = 0;
  selectedRows = new Set<any>();
  fromDate = '02-May-2023';
  toDate = '02-May-2024';
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  breadcrumbsHeading = [
    { label: 'Home', url: '/' },
    { label: 'Reports', url: '/reports' },
    { label: 'Action Summary', url: null }
  ];

  breadcrumbsActionSummary = [
    { label: 'All', url: '/' },
    { label: 'Status', url: '/status' },
    { label: 'Cancel', url: null },
    { label: `Created date valid from 02-May-2023 to 202-May-2024`, url: null },
  ];

  statuses = [
    { label: 'Open', count: 120, type: 'open' },
    { label: 'Overdue', count: 37, type: 'overdue' },
    { label: 'Closed', count: 52, type: 'closed' },
    { label: 'Cancelled', count: 14, type: 'cancelled' }
  ];
  dataSource: any;
  selectedFilter: any;
  constructor(private fb: FormBuilder, private dataService: DataService) {
    this.form = this.fb.group({
      officeVessel: ['vessel'],
      myVessel: [false],
      date: [''],
      reportType: [''],
      action: [''],
      fromDate: [''],
      toDate: [''],
    });

    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.dataService.getData().subscribe(data => {
      debugger
      this.filterOptions = data.filterOptions;
      this.summary = data.summary;
      this.tableData.data = data.tableData;
      this.totalRecords = data.tableData.length;
      this.createChart();
    });
  }

  ngAfterViewInit(): void {
    if (this.summary) {
      this.createChart();
    }
  }

  createChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }

    const data: ChartData = {
      labels: ['Open', 'Overdue', 'Closed', 'Cancelled'],
      datasets: [{
        data: [
          this.summary.status.open,
          this.summary.status.overdue,
          this.summary.status.closed,
          this.summary.status.cancelled
        ],
        backgroundColor: [
          'rgb(255, 159, 64)',
          'rgb(255, 99, 132)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)'
        ],
        borderColor: 'white',
        borderWidth: 2
      }]
    };

    const config: ChartConfiguration = {
      type: 'doughnut',
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        }
      }
    };

    this.chart = new Chart(this.chartCanvas.nativeElement, config);
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  onSearch(searchValue: any): any {
    const searchTerm = searchValue.target.value.trim().toLowerCase();
    this.tableData.filter = searchTerm;
    return this.tableData.filteredData;
  }

  toggleRow(row: any) {
    if (this.selectedRows.has(row)) {
      this.selectedRows.delete(row);
    } else {
      this.selectedRows.add(row);
    }
  }

  onSearchFilter() {
    console.log('Search clicked');
  }

  onFilter() {
    console.log('Filter clicked');
  }

  onOptions() {
    console.log('Options clicked');
  }

  toggleAllRows(event: MatCheckboxChange) {
    if (event.checked) {
      this.tableData.data.forEach(row => this.selectedRows.add(row));
    } else {
      this.selectedRows.clear();
    }
  }

  isAllSelected(): boolean {
    return this.tableData.data.length === this.selectedRows.size;
  }

  isRowSelected(row: any): boolean {
    return this.selectedRows.has(row);
  }

  nextPage(): void {
    if (this.paginator && this.paginator.hasNextPage()) {
      this.paginator.nextPage();
    }
  }

  previousPage(): void {
    if (this.paginator && this.paginator.hasPreviousPage()) {
      this.paginator.previousPage();
    }
  }

}
