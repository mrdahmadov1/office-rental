import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { MainRoutingModule } from './main-routing.module';

@NgModule({
  declarations: [HomeComponent, AboutComponent],
  imports: [CommonModule, RouterModule, MainRoutingModule],
  providers: [],
})
export class MainModule {}
