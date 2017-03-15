import { Component} from '@angular/core';
import { ModalController, LoadingController, Platform, NavParams, ViewController, App} from 'ionic-angular';
import { NativeStorage } from 'ionic-native';
import { FormBuilder, FormGroup, Validators , AbstractControl, FormControl } from '@angular/forms';
import { UserProfile } from '../../services/models';

@Component({
  selector: 'page-settings',
  templateUrl: 'edit-profile.html',
})
export class EditProfile {

  settingsForm: FormGroup;
  public profile: UserProfile;
  userName:AbstractControl;
  firstName:AbstractControl;
  lastName:AbstractControl;
  email:AbstractControl;

  profileForm: FormGroup;

  submitAttempt: boolean = false;

  constructor(
    private app: App,
    public params: NavParams,
    public loadingCtrl: LoadingController,
    public viewCtrl: ViewController,
    public formBuilder: FormBuilder) {

      this.settingsForm = new FormGroup({
      name: new FormControl(),
      location: new FormControl(),
      description: new FormControl(),
      currency: new FormControl(),
      weather: new FormControl(),
      notifications: new FormControl()
    });
  /*  this.profile = this.params.get("CurrentUser");
    let emailRegex = '^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$';
    this.profileForm = formBuilder.group({
        userName: [this.profile.userName,Validators.compose([Validators.maxLength(30),
                  Validators.pattern('[a-zA-Z ]*'),
                  Validators.required])],
        firstName: [this.profile.firstName,Validators.compose([Validators.maxLength(30),
                  Validators.pattern('[a-zA-Z ]*'),
                  Validators.required])],
        lastName: [this.profile.lastName,Validators.compose([Validators.maxLength(30),
                  Validators.pattern('[a-zA-Z ]*'),
                  Validators.required])],
        email:[this.profile.email,Validators.compose([Validators.maxLength(50),
                  Validators.pattern(emailRegex),
                  Validators.required])]
    });
    this.userName=this.profileForm.controls["userName"];
    this.firstName=this.profileForm.controls["firstName"];
    this.lastName=this.profileForm.controls["lastName"];
    this.email=this.profileForm.controls["email"];
    */
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  update() {
    this.submitAttempt = true;
    if(!this.profileForm.valid){
      let currrentView = this.viewCtrl;
      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });

      loading.present();
      this.profile.userName=this.profileForm.value.userName;
      this.profile.firstName=this.profileForm.value.firstName;
      this.profile.lastName=this.profileForm.value.lastName;
      this.profile.email=this.profileForm.value.email;
      NativeStorage.setItem('CurrentUser',this.profile)
      .then(function () {
        currrentView.dismiss();
        loading.dismiss();
      }, function (error) {
        console.log(error);
        currrentView.dismiss();
        loading.dismiss();
      })
    }
  }

   logout() {
    NativeStorage.remove('CurrentUser');
    const root = this.app.getRootNav();
    root.popToRoot();
  }

}
