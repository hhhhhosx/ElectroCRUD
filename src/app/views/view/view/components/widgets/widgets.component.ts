import { Component, OnInit, Input } from '@angular/core';
import { IView } from '../../../../../../shared/interfaces/views.interface';
import { IWidget } from '../../../../../../shared/interfaces/widgets.interface';
import { ViewsService } from '../../../../../services/store/views.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { AddEditWidgetModalComponent } from './add-edit-widget-modal/add-edit-widget-modal.component';

@Component({
  selector: 'app-widgets',
  templateUrl: './widgets.component.html',
  styleUrls: ['./widgets.component.scss']
})
export class WidgetsComponent implements OnInit {

  /**
   * Input for the widgets view
   */
  @Input() view:IView;

  /**
   * 
   * @param viewsService ViewsService dependency injection.
   */
  constructor(
    private viewsService:ViewsService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService
  ) { }

  ngOnInit() {
  }

  /**
   * Save the view after widgets modifications
   */
  save(): void {
    this.viewsService.update(this.view);
  }

  /**
   * Add new widget, open add new widget modal
   */
  protected add(): void {
    // Open Add / Edit dialog and wait for response (the user complete or close the dialog)
    this.dialogService
      .open<any>(AddEditWidgetModalComponent, { 
        hasBackdrop: true,
        context: {
          view: this.view // In add senerio we share only the view.
        }
      })
      .onClose
      .subscribe((res) => {
        if (res) {
          // Type Guard, validate that 'res' is IWidget
          if ((res as IWidget).name) {
            // if view.widgets is null, init the array
            if (!this.view.widgets) {
              this.view.widgets = [];
            }
            // Adds the widget to view.widgets
            this.view.widgets.push(res);
            // Save the view
            this.save();
            // Toast
            this.toastrService.success('The widget has been added');
          }
        }
      });
  }

  /**
   *  Edit widget, open edit widget modal
   * 
   * @param widget IWidget to edit
   */
  protected edit(widget: IWidget): void {
    // Open Add / Edit dialog and wait for response (the user complete or close the dialog)
    this.dialogService
      .open<any>(AddEditWidgetModalComponent, { 
        hasBackdrop: true,
        context: {
          view: this.view,
          widget: widget // In edit senerio we pass the widget we want to edit
        }
      })
      .onClose
      .subscribe((res) => {
        if (res) {
          // Type Guard, validate that 'res' is IWidget
          if ((res as IWidget).name) {
            // Save the view
            this.save();
            // Toast
            this.toastrService.success('The widget has been updated');
          }
        }
      });
  }

  /**
   * Delete widget from the view.
   * 
   * @param widget The widget for removal
   */
  remove(widget: IWidget): void {

  }

}