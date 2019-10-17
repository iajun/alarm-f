<template>
  <mu-container class="container">
    <mu-row gutter>
      <mu-col span="6">
        <mu-paper :z-depth="1" class="demo-list-wrap">
          <mu-appbar color="#993333">
            <mu-icon value="alarm" class="a-c m-r-10"></mu-icon>
            <span class="a-c">新英才学校AI智能监控系统</span>
          </mu-appbar>
          <mu-list>
            <div v-for="(val, key) in list" :key="val.id">
              <mu-list-item avatar button :ripple="false">
                <mu-list-item-action>
                  <mu-avatar>
                    <mu-icon value="queue_music" color="#993333"></mu-icon>
                  </mu-avatar>
                </mu-list-item-action>
                <mu-list-item-content>
                  <mu-list-item-title>{{val.name}}</mu-list-item-title>
                  <mu-list-item-sub-title>Oct 10, 2019</mu-list-item-sub-title>
                </mu-list-item-content>
                <mu-list-item-action>
                  <mu-button icon @click="onPlay(val)">
                    <mu-icon :value="val.icon" :color="val.current ? '#003300' : '#757575'"></mu-icon>
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
          <div class="map-wrapper">
            <baidu-map class="map" :center="targetItem.pos" :zoom="18">
              <bm-marker
                :position="targetItem.pos"
                :dragging="true"
                animation="BMAP_ANIMATION_BOUNCE"
              >
                <bm-info-window :show="show">出现危险信息</bm-info-window>
              </bm-marker>
              <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
            </baidu-map>
          </div>
        </mu-paper>
      </mu-col>
    </mu-row>
    <mu-row>
      <mu-col span="12">
        <div class="text-wrapper">
          <div class="text" v-html="text"></div>
        </div>
      </mu-col>
    </mu-row>
  </mu-container>
</template>

<script>
import getHighlight from "./getHighlight";

export default {
  name: "app",
  data() {
    return {
      show: false,
      list: [
        {
          id: 1,
          name: "第一条测试语音",
          icon: "play_circle_filled",
          pos: { lng: 116.870495, lat: 40.392025 },
          current: false
        },
        {
          id: 2,
          name: "第二条测试语音",
          icon: "play_circle_filled",
          pos: { lng: 116.664642, lat: 40.137513 },
          current: false
        },
        {
          id: 3,
          name: "第三条测试语音",
          icon: "play_circle_filled",
          pos: { lng: 116.735061, lat: 39.914466 },
          current: false
        },
        {
          id: 4,
          name: "第四条测试语音",
          icon: "play_circle_filled",
          pos: { lng: 116.735061, lat: 39.914466 },
          current: false
        },
        {
          id: 5,
          name: "第五条测试语音",
          icon: "play_circle_filled",
          pos: { lng: 116.306453, lat: 39.792149 },
          current: false
        }
      ],
      text: "",
      targetItem: {
        id: 0,
        icon: "",
        pos: {},
        current: false
      }
    };
  },
  methods: {
    onPlay(audio) {
      const { id } = audio;

      if (this.playId !== id) {
        this.audio.src = `http://localhost:3001/${id}.wav`;
      }
      if (
        this.playId === id &&
        this.audio.currentTime !== 0 &&
        !this.audio.paused
      ) {
        clearInterval(this.timer);
        this.targetItem.icon = "play_circle_filled";
        return this.audio.pause();
      }

      let pm = this.audio.play();
      pm.then(() => {
        let targetItem;
        for (const item of this.list) {
          if (item.id === id) {
            targetItem = item;
          } else {
            item.icon = "play_circle_filled";
            item.current = false;
          }
        }
        targetItem.icon = "pause_circle_filled";
        targetItem.current = true;
        this.targetItem = targetItem;

        this.timer = setInterval(() => {
          let { duration, currentTime } = this.audio;
          if (currentTime >= duration - 0.1) {
            this.targetItem.icon = "play_circle_filled";
            clearInterval(this.timer);
          }
        }, 100);
      });
      this.playId = id;
      this.onRecognize(id);
    },
    async onRecognize(id) {
      if (this.recognizingId === id) {
        return;
      }
      this.show = false;
      const ret = await this.axios.get(`voice/${id}`);
      const text = ret.result[0];
      let highlighted = getHighlight(text);
      this.text = highlighted;
      const count = highlighted.split("<mark>").length - 1;
      if (count > 0) {
        this.$toast.error({
          message: "发生危险情况, 请注意！",
          time: 160000,
          position: "top"
        });
        this.show = true;
      }
      this.recognizingId = id;
    }
  },
  mounted() {
    this.audio = new Audio();
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

.map-wrapper {
  height: 364px;
}

.text-wrapper {
  height: 140px;
  width: 100%;
  background: white;
  margin: 20px 0;
}

.a-c {
  vertical-align: middle;
}

.m-r-10 {
  margin-right: 10px;
}

.text {
  padding: 30px 50px;
  color: black;
}

.map {
  width: 100%;
  height: 364px;
}
</style>
