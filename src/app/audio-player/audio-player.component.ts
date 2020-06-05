import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.css']
})
export class AudioPlayerComponent implements OnInit, AfterViewInit {
  @ViewChild('music_player') player: ElementRef;
  @ViewChild('play_button') playImage: ElementRef;
  @ViewChild('vol_img') volumeImage: ElementRef;
  files: File[] = [];
  currentVolume = 1;
  currentFileIndex = 0;
  showList = false;

  constructor() {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.loadFile();
    this.player.nativeElement.addEventListener('ended', () => {this.skipNext(); }, false);
  }

  onFilesSelected(files: File[]) {
    const listIsEmpty = !this.files.length;
    this.files.push(...files);
    if (listIsEmpty) {
      this.loadFile();
    }
  }

  loadFile() {
    if (!this.files.length) { return; }
    this.player.nativeElement.innerHTML = '';
    const src = URL.createObjectURL(this.files[this.currentFileIndex]);
    const source = document.createElement('source');
    source.setAttribute('src', src);
    source.setAttribute('type', 'audio/mp3');

    this.player.nativeElement.appendChild(source);
    this.player.nativeElement.load();
  }

  toggleShowList() {
    this.showList = !this.showList;
  }

  togglePlay() {
    if (this.player.nativeElement.paused) {
      this.player.nativeElement.play();
      this.playImage.nativeElement.src = '../../assets/bx-pause.svg';
    } else {
      this.player.nativeElement.pause();
      this.playImage.nativeElement.src = '../../assets/bx-play.svg';
    }
  }

  changeVolume(event) {
    this.player.nativeElement.volume = event.target.value;
    this.currentVolume = event.target.value;
    if (this.player.nativeElement.volume) {
      this.volumeImage.nativeElement.src = '../../assets/bxs-volume.svg';
    } else {
      this.volumeImage.nativeElement.src = '../../assets/bxs-volume-mute.svg';
    }
  }

  toggleVolume() {
    if (this.player.nativeElement.volume) {
      this.player.nativeElement.volume = 0;
      this.volumeImage.nativeElement.src = '../../assets/bxs-volume-mute.svg';
    } else {
      this.player.nativeElement.volume = this.currentVolume;
      this.volumeImage.nativeElement.src = '../../assets/bxs-volume.svg';
    }
  }

  skipPrevious() {
    if (this.currentFileIndex < 1) {
      return;
    }
    const isPlaying = !this.player.nativeElement.paused;
    if (isPlaying) {
      this.togglePlay();
    }
    this.currentFileIndex = this.currentFileIndex - 1;
    this.loadFile();
    if (isPlaying) {
      this.loadFile();
      this.togglePlay();
    } else {
      this.loadFile();
    }
  }

  skipNext() {
    if (this.currentFileIndex >= this.files.length - 1) {
      return;
    }
    const isPlaying = !this.player.nativeElement.paused;
    if (isPlaying) {
      this.togglePlay();
    }
    this.currentFileIndex = this.currentFileIndex + 1;
    this.loadFile();
    if (isPlaying) {
      this.loadFile();
      this.togglePlay();
    } else {
      this.loadFile();
    }
  }

  setCurrentIndex(index) {
    const isPlaying = !this.player.nativeElement.paused;
    if (isPlaying) {
      this.togglePlay();
    }
    this.currentFileIndex = index;
    this.loadFile();
    if (isPlaying) {
      this.loadFile();
      this.togglePlay();
    } else {
      this.loadFile();
    }
  }

  deleteFile(index) {
    const isPlaying = !this.player.nativeElement.paused;
    if (isPlaying) {
      this.togglePlay();
    }
    this.files.splice(index, 1);
    if (this.currentFileIndex === index && index !== 0) {
      this.currentFileIndex = index - 1;
    }
    if (isPlaying) {
      this.loadFile();
      this.togglePlay();
    } else {
      this.loadFile();
    }
  }
}
