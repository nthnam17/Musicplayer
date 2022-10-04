// Tiến Độ Công Việc : 50%
// 1. Render songs 0k
// 1.1 Render songs for categories 0k 
// 2. Scroll top --
// 3. Play / Pause / seek  0k 
// 4. CD rotate  0k
// 5. Next / prev  0k
// 6. Random   0k
// 7. Next / Repeat when ended 
// 8. Active song  
// 9. Scroll active song into view 
// 10. Play song when click 
// 11. handle option
// 11.1 Download song when click option
// 11.2 Handle song love 



const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const cd = $('#cd');
const cdthumb = $('#cdthumb');
const playBtn = $('.actions__play')
const progress = $('#progress')
const curTime = $('#curtime')
const durTime = $('#durtime')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const volumeBar = $('.volume')
const volumeIcon = $('#volume-btn')

//  Create the home
const listSing = $('#listsong')
const listNewsing = $('#listNewsing')
const closeBtn = $('#btnclose')
const modal = $('.modal')
const signUp =$('#sign-up')
const signIn =$('#sign-in')
const switchBtn = $('#switch-btn')
const switchBtn1 = $('#switch-btn1')
const listBtn = $('#listbtn')
const listPlay = $('.listplay')



     const PLAYER_STORAGE_KEY = 'CHILLER-KEY'

const apiSongs = 'http://localhost:3000/newsing'

getList(playList)

function getList(callback) {
  fetch (apiSongs)
    .then(function(response) {
      return response.json()
    })
    .then(callback)
    .catch(function(err) {
      console.log('Loi', err)
    })
}

function playList(listSong) {
  var app = {
    currentIndex : 0,
    isPlaying : false,
    isRandom : false,
    isRepeat : false,
    isMute : false,
     config : JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: listSong,
    setConfig : function(key, value) {
      this.config[key] = value
      localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render: function() {
        const htmls = this.songs.map ((song , index) => {
             return `<div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = "${index}">
             <div class="song__left">
                 <img src="${song.thumb}" alt="" class="song__img">
                 <div class="song__content">
                     <h3 class="song__name">${song.name}</h3>
                     <p class="song__artist">${song.artist}</p>
                 </div>
                
             </div>
             
             <div class="song__right">
                <span class="song__fulltimes">3:68</span>               
                <i class="fa-regular fa-heart media__right-favorite listplay__icon"></i             
                <i class="fa-solid fa-heart media__right-favorited"></i>
                <i class="fa-solid fa-ellipsis-vertical  media__right-options listplay__icon"></i>
             </div>
         </div>`
        })
        listSing.innerHTML = htmls.join('');
        // render new sing list
        const htmlsb = this.songs.map ((song, index) => {
          return `<div class="grid__column-3-12 newsing__content-wrap">
          <ul  class="newsing__list">
              <li class="newsing__item ${index === this.currentIndex ? 'active' : ''}" data-index = "${index}"><div href="" class="newsing__link">
                  <div class="newsing__content">
                      <img src="${song.thumb}" alt="" class="newsing__thumb">
                      <div class="newsing__info">
                          <h4 class="newsing__name">${song.name}</h4>
                          <p class="newsing__artist">${song.artist}</p>
                          <span class="newsing__time">2 Ngày Trước</span>
                      </div>
                  </div>
                  <div class="newsing__options">
                      <i class="fa-solid fa-ellipsis-vertical newsing__options-icon"></i>
                  </div>
              </div></li>
          </ul>
      </div>`
     })
     listNewsing.innerHTML = htmlsb.join('');
      },
    
    defineProperties: function() {
          Object.defineProperty(this, 'currentSong' , {
            get: function() {
              return this.songs[this.currentIndex]
            }
          })
       },

       handleEvents: function() {
    //     // const cdWidth = cd.offsetWidth
        const _this = this
        // Xử lý cd quay
        const cdthumbAnimation =  cdthumb.animate([
          {
            transform: 'rotate(360deg)'
          }
        ],
        {
            duration: 10000, // 10sec
            iterations: Infinity
        })
        cdthumbAnimation.pause()
      
    //     // Xử Lý thu nhỏ cd khi xem list nhạc
    //     // document.onscroll = function() {
    //     //   const scrollTop = document.documentElement.scrollTop
    //     //   const newCdWidth = cdWidth - scrollTop;
    //     //   cd.style.width = newCdWidth > 0 ? newCdWidth+ 'px' : 0;
    //     //   cdWidth.style.opacity = newCdWidth / cdWidth ;
    //     // },
      
        playBtn.onclick = function() {
          if(_this.isPlaying){
              audio.pause();
          }else{
             audio.play();
          }
        },
      
        //Khi play
          audio.onplay = function() {
            _this.isPlaying = true;
            cdthumbAnimation.play()
            playBtn.classList.add('playing')
          },
        //Khi pause
        audio.onpause = function() {
          _this.isPlaying = false
          cdthumbAnimation.pause()
          playBtn.classList.remove('playing')
        },
        //Thời Gian  chạy
        audio.ontimeupdate = function() {
           if(audio.duration){
            const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
            progress.value = progressPercent
           }
        },
        // Xử lý khi tua
        progress.onchange = function(e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        },
        // Thời Gian Thực Song
         audio.addEventListener('timeupdate', function (){
            const currentTime = audio.currentTime
            var min = Math.floor(currentTime / 60)
            var sec = Math.floor(currentTime % 60)
            curTime.innerText = (min < 10 ? '0' + min : min) + ':' + (sec < 10 ? '0' + sec : sec)
         }),
         // Tổng thời gian bài hát
         audio.onloadedmetadata = function () {
          duration = audio.duration
          var min = Math.floor(duration / 60)
          var sec = Math.floor(duration % 60)
          durTime.innerText = (min < 10 ? '0' + min : min) + ':' + (sec < 10 ? '0' + sec : sec)
        },
        // Xử lý nút next
        nextBtn.onclick = function() {
          if(_this.isRandom) {
            _this.randomSong()
          }else {
            _this.nextSong()
          }
          audio.play()
        },
        // Xử lý nút prev
        prevBtn.onclick = function() {
          if(_this.isRandom) {
            _this.randomSong()
          }else {
            _this.prevSong()
          }
          audio.play()
        }
        //Xử lý random 
        randomBtn.onclick = function() {
          _this.isRandom = !_this.isRandom
          _this.setConfig('isRandom',_this.isRandom)
           randomBtn.classList.toggle('active',_this.isRandom)
        },
        audio.onended = function() {
          if(_this.isRandom) {
            _this.randomSong()
          }else {
            _this.nextSong()
          }
          audio.play()
        },
        repeatBtn.onclick = function() {
          _this.isRepeat = !_this.isRepeat
          _this.setConfig('isRepeat',_this.isRepeat)
          repeatBtn.classList.toggle('active',_this.isRepeat)
        },
        audio.onended = function() {
          if (_this.isRepeat) {
            audio.play()
          }else {
            nextBtn.click()
          }
        },
        // Xử Lý khi click vào bai hat
        listSing.onclick = function(e) {
          const songNode = e.target.closest('.song:not(.active)')

          if(songNode ||e.target.closest('.options')) {
            if (songNode) {
                _this.currentIndex = Number(songNode.dataset.index)
                _this.render()
                _this.loadCurrentSong()
                audio.play()
            }

            if (e.target.closest('.options')) {

            }

          }
        }
        listNewsing.onclick = function(e) {
          const songNode = e.target.closest('.newsing__item:not(.active)')
            if (songNode) {
                _this.currentIndex = Number(songNode.dataset.index)
                _this.render()
                _this.loadCurrentSong()
                audio.play()
            }
        }
        volumeIcon.onclick = function () {
          _this.isMute = !_this.isMute;
          // console.log({ volumeBar });
          _this.setConfig('isMute', _this.isMute);
          volumeIcon.classList.toggle('active', _this.isMute);
          if (_this.isMute) {
            audio.volume = 0;
            volumeBar.value = 0;
          } else {
            volumeBar.value = _this.currentVolume * 100;
            audio.volume = _this.currentVolume;
          }
        };
    
        volumeBar.onchange = function (e) {
          _this.currentVolume = e.target.value / 100;
          audio.volume = _this.currentVolume;
          _this.setConfig('currentVolume', _this.currentVolume);
          audio.play();
          if (audio.volume === 0) {
            volumeIcon.classList.add('active');
          } else {
            _this.isMute = false;
            _this.setConfig('isMute', _this.isMute);
            volumeIcon.classList.remove('active');
          }
        };

                // handle events form sign in sign up
        //Xử lsy đóng modal
        closeBtn.onclick = function() {
            modal.classList.add("disable")
        },
        //xu ly form sign in 
        switchBtn.onclick = function() {
            signIn.classList.remove("active")
            signUp.classList.add("active")
        },
        switchBtn1.onclick = function() {
            signUp.classList.remove("active")
            signIn.classList.add("active")
        },
        listBtn.onclick = function() {
            listPlay.classList.toggle("active")
        }

           },
    //    //Load bai hat hien tai
       loadCurrentSong: function() {
          const heading = $('.media__content-name');
          const artist = $('.media__content-artist');
          const playingName =$('#playing-name')
          const playingArtist =$('#playing-artist')
          const playingThumb = $('#playing-thumb')
          const audio = $('#audio');

          playingName.textContent = this.currentSong.name
          playingArtist.textContent = this.currentSong.artist
          heading.textContent = this.currentSong.name
          artist.textContent = this.currentSong.artist
          cdthumb.style.backgroundImage = `url('${this.currentSong.thumb}')`
          playingThumb.style.backgroundImage = `url('${this.currentSong.thumb}')`
          audio.src = this.currentSong.path
       },
      //  Khi next bai hat
       nextSong: function() {
          this.currentIndex ++
          if( this.currentIndex >= this.songs.length){
            this.currentIndex = 0
          }
          this.loadCurrentSong()
          this.render()
          this.scrollActiveintoview()
       },
       //Khi prev bai hat
       prevSong: function() {
        this.currentIndex --
        if( this.currentIndex < 0){
          this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
        this.render()
      },
      
      //Khi Bật tính năng ngẫu nhiên
        randomSong: function() {
            let newIndex
            do {
              newIndex = Math.floor(Math.random() * this.songs.length)
            } while (newIndex === this.currentIndex);
           
            console.log(newIndex)
            this.currentIndex = newIndex
            this.loadCurrentSong()
        },

        scrollActiveintoview: function() {
          let _this = this
          setTimeout(() => {
            $(".song.active").scrollIntoView({
              behavior: "smooth",
              block: _this.currentIndex < 2 ? "end" : "center",
            });
          },500)
        },
        loadConfig: function() {
          this.isRandom = this.config.isRandom
          this.isRepeat = this.config.isRepeat
          this.isMute = this.config.isMute
        },


    


        

      


    start: function(){

      this.loadConfig()

      this.defineProperties()
  
      this.handleEvents()
  
      this.loadCurrentSong()
  
      this.render()
    
   }

  }
  app.start();
}


 
 