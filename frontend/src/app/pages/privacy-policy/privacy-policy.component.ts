import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConfigService} from '../../services/config.service';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {
  privacyVersion: string = '';

  constructor(private configService: ConfigService) {
  }

  ngOnInit(): void {
    this.privacyVersion = this.configService.getPrivacyVersion();
  }
}
