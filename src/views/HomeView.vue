<template>
  <main>




    <div class="waring">
      <h2>Привет, друзья!</h2>
      <p>Хочу предупредить, что сейчас сайт находится в разработке. К сожалению, я больше не могу оплачивать хостинг старой версии, поэтому пришлось перенести новую версию на другой сервер. На этом этапе могут возникнуть небольшие неполадки или нестабильная работа.</p>
      <p>Если для вас это критично, вы всегда можете воспользоваться <a href="http://jardic.ru" target="_blank" rel="noopener noreferrer">оригиналом</a>. Прошу прощения за возможные неудобства и благодарю за ваше понимание!</p>
      <p>С уважением, Даниил</p>
    </div>

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
    <p class="img-comment"><strong>{{ $t('home.note') }}: </strong><span v-html="jardic_url($t('home.note_t'), 'jardic.ru')"></span>
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

<style lang="scss">
.waring {
  margin-top: 20px;
  padding: 10px 20px;
  border-radius: 10px;
  background-color: #d16464cc;
}
</style>