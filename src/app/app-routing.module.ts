import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActionSummaryComponent } from './action-summary/action-summary.component';


const routes: Routes = [
    { path: '', redirectTo: 'action-summary', pathMatch: 'full' },
    { path: 'action-summary', component: ActionSummaryComponent },
    { path: '**', redirectTo: 'action-summary' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
