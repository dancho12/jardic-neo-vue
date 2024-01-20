<template>
    <main>

        <div class="word-parse">
            <div class="word-parse-elem" :class="{
                active: parse_word_key == index
            }" v-for="(word, index) in parse_words" @click="parse_word_key = index">{{ word }}</div>
        </div>
        <div class="paginator">
            <div class="paginator-page" :class="{
                'cur': page.cur
            }" v-for="page in paginator" :key="page" @click="change_page(page.page)">
                <span class="val" v-if="page.before == undefined && page.next == undefined && page.dot == undefined">{{
                    page.page }}</span>
                <span class="val" v-if="page.dot">...</span>
                <SVGIcon class="val" v-if="page.before" :name="'prev_p'" :size="10" />
                <SVGIcon class="val" v-if="page.next" :name="'next_p'" :size="10" />
            </div>
            <template v-if="loading && !loading_page">
                <div class="paginator-page " :class="{
                    skeleton: page != 1 && page != 8
                }" v-for="page in 8">
                    <SVGIcon class="val" v-if="page == 1" :name="'prev_p'" :size="10" />
                    <SVGIcon class="val" v-if="page == 8" :name="'next_p'" :size="10" />
                </div>
            </template>
        </div>
        <div class="words-list">
            <template v-if="loading">
                <div v-for="card in 8" class="word-card">
                    <div style="width: 70%;">
                        <span class="skeleton skeleton-text" style="width: 35px;"></span>
                        <span class="skeleton skeleton-text" style="width: 35px;"></span>
                        <span class="skeleton skeleton-text" style="width: 80%;"></span>
                        <span class="skeleton skeleton-text" style="width: 90%;"></span>
                        <span class="skeleton skeleton-text" style="width: 80%;"></span>
                        <span class="skeleton skeleton-text" style="width: 60%;"></span>
                    </div>
                    <div class="dic">
                        <span class="skeleton skeleton-text" style="width: 50px;"></span>
                    </div>
                </div>
            </template>
            <div class="word-card" v-for="card in cards[parse_word_key]" :key="card" v-html="card"></div>
        </div>
        <div class="paginator">
            <div class="paginator-page" :class="{
                'cur': page.cur
            }" v-for="page in paginator" :key="page" @click="change_page(page.page)">
                <span class="val" v-if="page.before == undefined && page.next == undefined && page.dot == undefined">{{
                    page.page }}</span>
                <span class="val" v-if="page.dot">...</span>
                <SVGIcon class="val" v-if="page.before" :name="'prev_p'" :size="10" />
                <SVGIcon class="val" v-if="page.next" :name="'next_p'" :size="10" />
            </div>
            <template v-if="loading && !loading_page">
                <div class="paginator-page " :class="{
                    skeleton: page != 1 && page != 8
                }" v-for="page in 8">
                    <SVGIcon class="val" v-if="page == 1" :name="'prev_p'" :size="10" />
                    <SVGIcon class="val" v-if="page == 8" :name="'next_p'" :size="10" />
                </div>
            </template>

        </div>

    </main>
</template>

<script>


import axios from 'axios';
import cheerio from 'cheerio';
import { RouterLink, RouterView, useRouter, useRoute } from 'vue-router'
import { defineComponent, ref, onMounted, onUnmounted, inject, watch } from 'vue';

export default defineComponent({
    name: 'SearchView',
    setup() {

        const pageTitle = ref('');
        const links = ref([]);
        const cards = ref({});

        const cur_page = ref(1);

        const q = inject('search');
        const t = inject('t');
        const selectedDic = inject('selectedDic');



        const paginator = ref([]);

        const loading = ref(true);
        const loading_page = ref(false);


        const parse_word_key = ref('all');
        const parse_words = ref({});

        const screenWidth = ref(window.innerWidth);
        const handleResize = () => {
            screenWidth.value = window.innerWidth;
        };


        watch(t, () => {

            cur_page.value = 1;
            cards.value = {};
            paginator.value = []
            loading.value = true;
            loading_page.value = false;
            parse_word_key.value = 'all'
            parse_words.value = {}
            fetchPageData();
        });
        const fetchPageData = () => {

            var dic = "";
            for (const dic_k in selectedDic.value) {
                dic += "&" + dic_k + "=1"
            }
            var url = 'https://www.jardic-neo.ru/mirror?q=' + q.value + dic + '&page=' + cur_page.value
            console.log(url);
            axios.get(url)
                .then(response => {
                    const $ = cheerio.load(response.data);

                    // Получение заголовка страницы
                    pageTitle.value = $('title').text();







                    var tmp_cards_all = [];
                    $('#tabContent tr').each((index, element) => {

                        var not_skip = true;

                        if ($(element).children().first()[0].attribs.colspan != undefined) {
                            if ($(element).children().first()[0].children[0].attribs.class == 'interart') {
                                not_skip = false;
                            }
                        }
                        if (not_skip) {
                            let html = $(element).children().first().html()
                            html = colors_fix(html);
                            let all = '<div>' + html + '</div>';
                            if ($(element).children().length != 1) {
                                let last = $(element).children().last().html()
                                all += '<div class="dic">' + last + '</div>';
                            }
                            tmp_cards_all.push(all);
                        }

                    });


                    if ($('#tabParsed .wordLink').length != 0) {
                        var p_words = {}
                        $('#tabParsed .wordLink').each((index, element) => {
                            let ar = element.attribs.id.split('-');
                            p_words[ar[1]] = ar[2];
                            parse_words.value[ar[1]] = $(element).text()
                        });

                        parse_word_key.value = 0;

                        var tmp_cards = {};

                        var i = 0;
                        for (const key in p_words) {

                            tmp_cards[key] = []
                            let to = i + Number(p_words[key]);
                            for (let index = i; index < to; index++) {
                                tmp_cards[key].push(tmp_cards_all[index])
                                i++;
                            }

                        }

                        cards.value = tmp_cards;

                    } else {
                        cards.value = { all: tmp_cards_all }
                    }







                    if ($('td .cur').length != 0) {
                        let cur = Number($('td .cur').text())
                        let blk_f = Number($('td .blk').children().first().text())
                        let blk_l = Number($('td .blk').children().last().text())

                        console.log(cur, blk_f, blk_l);

                        var to = 0;

                        var pages = [];
                        if (cur == 1) {
                            to = blk_l;
                        } else if (cur > blk_l) {
                            to = cur
                        } else {
                            to = blk_l;
                        }
                        pages.push({
                            page: cur == 1 ? 1 : cur - 1,
                            before: true
                        });

                        for (let index = 1; index <= to; index++) {
                            if (index == cur) {
                                pages.push({
                                    page: index,
                                    cur: true
                                });
                            } else {
                                pages.push({
                                    page: index,
                                });
                            }
                        }

                        pages.push({
                            page: cur != to ? cur + 1 : cur,
                            next: true
                        });


                        if (screenWidth.value <= 768) {
                            let space_for_paginator = screenWidth.value - 16;
                            let count_of_p = parseInt(space_for_paginator / 40);

                            if ((to + 2) > count_of_p) {

                                var pages_new = [];
                                pages_new.push({
                                    page: cur == 1 ? 1 : cur - 1,
                                    before: true
                                });
                                let middle = count_of_p - 4;

                                if (cur < middle - 1) {
                                    for (let index = 1; index < middle; index++) {
                                        if (index == cur) {
                                            pages_new.push({
                                                page: index,
                                                cur: true
                                            });
                                        } else {
                                            pages_new.push({
                                                page: index,
                                            });
                                        }
                                    }
                                    pages_new.push({
                                        dot: true,
                                    });
                                    pages_new.push({
                                        page: to,
                                    });
                                } else if ((cur >= middle - 1) && (cur < (to - (middle - 3)))) {
                                    pages_new.push({
                                        page: 1,
                                    });
                                    pages_new.push({
                                        dot: true,
                                    });
                                    for (let index = cur - 1; index < cur + 2; index++) {
                                        if (index == cur) {
                                            pages_new.push({
                                                page: index,
                                                cur: true
                                            });
                                        } else {
                                            pages_new.push({
                                                page: index,
                                            });
                                        }
                                    }
                                    pages_new.push({
                                        dot: true,
                                    });

                                    pages_new.push({
                                        page: to,
                                    });
                                } else {
                                    pages_new.push({
                                        page: 1,
                                    });
                                    pages_new.push({
                                        dot: true,
                                    });
                                    for (let index = (to - (middle - 2)); index <= to; index++) {
                                        if (index == cur) {
                                            pages_new.push({
                                                page: index,
                                                cur: true
                                            });
                                        } else {
                                            pages_new.push({
                                                page: index,
                                            });
                                        }
                                    }
                                }

                                pages_new.push({
                                    page: cur != to ? cur + 1 : cur,
                                    next: true
                                });

                                pages = pages_new
                            }

                        }


                        paginator.value = pages;
                        cur_page.value = cur;
                    }
                    loading.value = false;
                })
                .catch(error => {
                    console.error('Ошибка при получении страницы:', error);
                });
        };


        function colors_fix(html) {

            let colors = {
                "#BF0000": "--find-color",
                "#7F0000": "--reading-color",
                "#00007F": "--kanji-color",
                "#000000": "--text-color",
                "#7F7F7F": "--special-color-1",
                "#005F00": "--special-color-2",
            }
            for (const key in colors) {
                let fin = 'color="' + key + '"';

                html = html.replace(new RegExp(fin, 'g'), 'style="color: ' + key + ';"');
                html = html.replace(new RegExp(key, 'g'), "var(" + colors[key] + ")");
            }
            return html;
        }

        onMounted(() => {
            fetchPageData();
            // fetchPageData2();
            window.addEventListener('resize', handleResize);
        });


        onUnmounted(() => {
            window.removeEventListener('resize', handleResize);
        });



        /*         const fetchPageData2 = () => {
        
        
                    var url = 'https://www.jardic-neo.ru/mirror2'
                    console.log(url);
                    axios.get(url)
                        .then(response => {
                            const $ = cheerio.load(response.data);
        
                            $('.word_t td').each((index, element) => {
        
                                console.log($(element).html());
                            })
        
        
                        })
                        .catch(error => {
                            console.error('Ошибка при получении страницы:', error);
                        });
                }; */


        function change_page(page) {
            cur_page.value = page;
            cards.value = {};
            // paginator.value = []
            loading.value = true;
            loading_page.value = true;
            fetchPageData();
        }




        return {
            pageTitle,
            links,
            cards,
            paginator,
            change_page,
            loading,
            loading_page,
            parse_word_key,
            parse_words,
        };
    },
});

</script>

<style lang="scss">
.words-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.word-card {
    padding: 10px 30px;
    border-radius: 10px;
    background: var(--cards-background-color);
    display: flex;

    & .dic {
        width: auto;
        margin-right: 0;
        margin-left: auto;
        margin-top: auto;
        margin-bottom: 0;
        color: var(--special-color-1) !important;

        & a {
            color: var(--kanji-color);
        }
    }
}

.paginator {
    display: flex;
    margin-top: 14px;
    margin-bottom: 14px;
    width: min-content;
    gap: 5px;
    margin-left: auto;
    margin-right: auto;

    &-page {
        width: 35px;
        height: 35px;

        display: flex;
        cursor: pointer;

        & .val {
            margin: auto;
        }



        border-radius: 20px;


        &.cur {
            background-color: var(--accent-color);
            color: #fff;

            &:hover {
                background-color: var(--accent-color) !important;
            }
        }

        &:hover {
            background-color: var(--paginator-hover);
        }

    }
}


.skeleton {
    animation: skeleton-loading 1s linear infinite alternate;
}

@keyframes skeleton-loading {
    0% {
        background-color: var(--skeleton-0);
    }

    100% {
        background-color: var(--skeleton-100);
    }
}

.skeleton-text {
    display: block;
    width: 100%;
    height: 1rem;
    margin-bottom: 0.5rem;
    border-radius: 0.25rem;
}


.word-parse {
    display: flex;
    gap: 6px;
    margin-top: 14px;

    &-elem {
        padding: 2px 6px;
        cursor: pointer;
        border-radius: 5px;
        background-color: var(--cards-background-color);
        color: var(--text-color);

        &.active {
            background-color: var(--accent-color);
            color: #fff;
        }
    }

}
</style>