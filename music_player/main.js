// 1.render Song
// 2.Scroll Top
// 3.Play/ pause/ seek
// 4.Cd rotate
// 5.Next/ prev
// 6.Random
// 7.next/ repeat when ended
// 8.Active Song
// 9.Scroll active song
//10. play song when click


const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $('.player');
const playList = $('.playlist');

const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const btnPlay = $('.btn-toggle-play');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs:
    [
        {
            name: 'Đế Vương',
            singer: 'Đình Dũng',
            path: './asetss/music/song1.mp3',
            image: './asetss/img/De_vuong.jpg'
        },
        {
            name: 'Cua',
            singer: 'Hiếu ThuHai',
            path: './asetss/music/song2.mp3',
            image: './asetss/img/hieuthuhai.jpg'
        },
        {
            name: 'Túy Âm',
            singer: 'Masew và Xesi',
            path: './asetss/music/song3.mp3',
            image: './asetss/img/tuy_am.jpg'
        },
        {
            name: 'Chạy về nơi phía anh',
            singer: 'Khắc việt',
            path: './asetss/music/song4.mp3',
            image: './asetss/img/khacviet.jpg'
        },
        {
            name: 'Kẻ cắp gặp bà già',
            singer: 'Hoàng Thùy Linh',
            path: './asetss/music/song5.mp3',
            image: './asetss/img/bagia.jpg'
        },
        {
            name: 'Suy nghĩ trong anh',
            singer: 'Khắc Việt',
            path: './asetss/music/song6.mp3',
            image: './asetss/img/khacviet_2.jpg'
        },
        {
            name: 'Sài Gòn đau lòng quá',
            singer: 'Hứa Kim Tuyền',
            path: './asetss/music/song7.mp3',
            image: './asetss/img/saigon.jpg'
        },
        {
            name: 'Ái nộ',
            singer: 'Masew',
            path: './asetss/music/song8.mp3',
            image: './asetss/img/aino.jpg'
        },
        {
            name: 'Cưới thôi',
            singer: 'Masew & Bray',
            path: './asetss/music/song9.mp3',
            image: './asetss/img/cuoithoi.jpg'
        },
        
    ],
    render: function() {
        const htmls = this.songs.map(function(song, index) {
            return `
            <div class="song ${index === app.currentIndex ? 'active' : ''}" data-index = "${index}">
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playList.innerHTML = htmls.join('');
    },
    defindProperties: function() {
        Object.defineProperty(this, 'currentSong',{
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },

    handalEvents: function() {
        //Xử lý phóng to hoặc thu nhỏ
        const cdWidth = cd.offsetWidth;
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newcdWidth = cdWidth - scrollTop;
            cd.style.width = newcdWidth > 0 ? newcdWidth + 'px' : 0;
            cd.style.opacity = newcdWidth/cdWidth;
        }
        // Xử lý CD quay/ dừng:
        const cdThumbAnimate = cdThumb.animate([
            {
                transform: 'rotate(360deg)'
            }
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause();
        // Xử lý nút play
        btnPlay.onclick = function() {
            if(app.isPlaying) {

                audio.pause();
            }else {
               
                audio.play();
            }
        }
        // lang nghe play
        audio.onplay = function() {
            app.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }
        audio.onpause = function() {
            app.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration *100);
                progress.value = progressPercent;
            }
        }
        progress.onchange = function(e) {
            const seekTime = audio.duration /100 * e.target.value;
            audio.currentTime = seekTime;
        }
        // Xử lý nút next
        nextBtn.onclick = function() {
            if(app.isRandom) {
                app.randomSong();
            }else{

                app.nextSong();
            }
            audio.play();
            app.render();
            
        }
        // nút prev song
        prevBtn.onclick = function() {
            if(app.isRandom) {
                app.randomSong();
            }else{

                app.prevSong();
            }
            audio.play();
            app.render();
            


        }
        //Khi hết bài hát
        audio.onended = function() {
            if(app.isRepeat) {
                audio.play();
            }else {
                nextBtn.onclick();
            }           
        }

        // nút random

        randomBtn.onclick = function(e) {
            app.isRandom = !app.isRandom;
            randomBtn.classList.toggle('active', app.isRandom);
            
        }

        //lắng nghe click vào bài hát
        playList.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)');
            const optionnode = e.target.closest('.option');
            if (songNode || optionnode) {
                // nếu click vào song
                if(songNode) {  
                    app.currentIndex = Number(songNode.getAttribute('data-index'));
                    app.loadCurrentSong();
                    app.render();
                    audio.play();
                }
                //xử lý khi clck vào option
                if(optionnode) {

                }
            }
        }

        //  nút repeat song
        repeatBtn.onclick = function(e) {
            app.isRepeat = !app.isRepeat;
            repeatBtn.classList.toggle('active', app.isRepeat);
        }
    },



    loadCurrentSong: function() {

        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },

    nextSong: function() {
        this.currentIndex ++;
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong();
    },

    prevSong: function() {
        this.currentIndex --;
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length -1
        }
        this.loadCurrentSong();
    },

    randomSong: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        }while(newIndex == this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },


    start: function() {
        // định nghĩa thuộc tính
        this.defindProperties();

        // lắng  nghe và xử lý event(DOM event)
        this.handalEvents();

        //Load bài hát đầu tiên khi ứng dụng chạy
        this.loadCurrentSong();

        // Tải danh sách bài hát ra giao diện UI
        this.render();
    }
}
app.start()