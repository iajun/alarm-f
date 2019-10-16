<template>
  <mu-container class="container">
    <mu-row gutter>
      <mu-col span="6">
        <mu-paper :z-depth="1" class="demo-list-wrap">
          <mu-appbar color="lightBlue400">
            <mu-icon value="alarm" class="a-c m-r-10"></mu-icon>
            <span class="a-c">校园危险识别系统</span>
          </mu-appbar>
          <mu-list>
            <div v-for="(val, key) in list" :key="val.id">
              <mu-list-item avatar button :ripple="false">
                <mu-list-item-action>
                  <mu-avatar>
                    <mu-icon value="library_music"></mu-icon>
                  </mu-avatar>
                </mu-list-item-action>
                <mu-list-item-content>
                  <mu-list-item-title>第{{key+1}}条语音</mu-list-item-title>
                  <mu-list-item-sub-title>Jan 9, 2014</mu-list-item-sub-title>
                </mu-list-item-content>
                <mu-list-item-action>
                  <mu-button icon @click="onPlay(val)">
                    <mu-icon :value="val.icon"></mu-icon>
                  </mu-button>
                </mu-list-item-action>
              </mu-list-item>
              <mu-divider v-if="key < list.length - 1"></mu-divider>
            </div>
          </mu-list>
        </mu-paper>
      </mu-col>
      <mu-col span="6">
        <mu-paper :z-depth="2">
          <div class="text-wrapper">
            <!-- <mu-appbar color="pink">
              <mu-icon value="alarm" class="a-c m-r-10"></mu-icon>
              <span class="a-c">识别结果</span>
            </mu-appbar>-->
            <div class="text">{{text}}</div>
          </div>
        </mu-paper>
      </mu-col>
    </mu-row>
  </mu-container>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      list: [
        {
          id: "16k.wav",
          icon: "play_circle_filled"
        },
        {
          id: "test.wav",
          icon: "play_circle_filled"
        },
        {
          id: 3,
          icon: "play_circle_filled"
        },
        {
          id: 4,
          icon: "play_circle_filled"
        },
        {
          id: 5,
          icon: "play_circle_filled"
        }
      ],
      text: ""
    };
  },
  methods: {
    onPlay(audio) {
      const { id } = audio;
      this.audio = new Audio();
      this.audio.src = `http://localhost:3001/${id}`;
      let pm = this.audio.play();
      pm.then(() => {
        let targetItem;
        for (const item of this.list) {
          if (item.id === id) {
            targetItem = item;
          }
        }
        targetItem.icon = "pause_circle_filled";

        setInterval(() => {
          let { duration, currentTime } = this.audio;
          if (currentTime >= duration) {
            targetItem.icon = "play_circle_filled";
          }
        }, 100);
      });
      this.onRecognize(id);
    },
    async onRecognize(id) {
      const ret = await this.axios.get(`voice/${id}`);
      this.text = ret.result[0];
    }
  }
};
</script>

<style>
.container {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.text-wrapper {
  height: 364px;
}

.a-c {
  vertical-align: middle;
}

.m-r-10 {
  margin-right: 10px;
}

.text {
  padding: 30px 50px;
}
</style>
