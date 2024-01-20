<template>
  <main>




    <h1 v-html="jardic_url($t('home.title'), 'Jardic')"></h1>
    <p>{{ $t('home.enter') }}</p>
    <p>{{ $t('home.open_dic') }}</p>
    <p>{{ $t('home.find_in') }}</p>
    <table>
      <tbody>
        <tr>
          <td>Jardic</td>
          <td>{{ $t('home.dic_jardic') }}</td>
        </tr>
        <tr>
          <td>Warodai</td>
          <td>{{ $t('home.dic_warodai') }}</td>
        </tr>
        <tr>
          <td>ЯРКСИ</td>
          <td>{{ $t('home.dic_yarxi') }}</td>
        </tr>
        <tr>
          <td>БКРС</td>
          <td>{{ $t('home.dic_bkrs') }}</td>
        </tr>
        <tr>
          <td>Medic</td>
          <td>{{ $t('home.dic_medic') }}</td>
        </tr>
        <tr>
          <td>Tatoeba</td>
          <td>{{ $t('home.dic_tatoeba') }}</td>
        </tr>
        <tr>
          <td>Edict</td>
          <td>{{ $t('home.dic_edict') }}</td>
        </tr>
        <tr>
          <td>Kandjidic</td>
          <td>{{ $t('home.dic_kanjidic') }}</td>
        </tr>
        <tr>
          <td>Enamdict</td>
          <td>{{ $t('home.dic_enamdict') }}</td>
        </tr>
        <tr>
          <td>Unihan</td>
          <td>{{ $t('home.dic_unihan') }}</td>
        </tr>
        <tr>
          <td>Chekhov</td>
          <td>{{ $t('home.dic_chekhov') }}</td>
        </tr>
        <tr>
          <td>Laws of Japan</td>
          <td>{{ $t('home.dic_japaneselaw') }}</td>
        </tr>
        <tr>
          <td>Stories</td>
          <td>{{ $t('home.dic_stories') }}</td>
        </tr>
      </tbody>
    </table>
    <p class="img-comment"><strong>{{ $t('home.note') }}: </strong><span
        v-html="jardic_url($t('home.note_t'), 'jardic.ru')"></span>
    </p>
    <p class="img-comment">{{ $t('home.contact') }}<br><a href="mailto: info@jardic-neo.ru">info@jardic-neo.ru</a><br>
      Telegram - <a href="https://t.me/daniirukov" target="_blank" rel="noopener noreferrer">@daniirukov</a></p>


  </main>
</template>

<script>
import { defineComponent, ref, onMounted, inject } from 'vue';

export default defineComponent({
  setup() {
    function jardic_url(text, url_text) {
      return text.replace("*url*", '<a href="http://jardic.ru" target="_blank" rel="noopener noreferrer">' + url_text + '</a>')
    }
    return {
      jardic_url
    };
  },
});

</script>

<style lang="scss"></style>