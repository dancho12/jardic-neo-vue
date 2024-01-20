<template>
    <div class="search">
        <div class="search-box" :class="{ 'error': box_error }" v-click-out-side="() => dic_list_open = false">
            <SVGIcon class="search-box-img" :name="'SearchOutlineBlack'" :color="'var(--accent-color-gray)'" :size="24" />
            <input ref="query" type="text" :placeholder="$t('nav.search.placeholder')" :value="search" @input="inputHandler"
                @keyup.enter="open_search">
            <div class="search-box-sel-list">
                <div class="elem" v-for="d in selectedDic_l">{{ d }}</div>
            </div>

            <SVGIcon v-if="search_tmp != ''" @click="clear_input()" :name="'close-circle'"
                :color="'var(--accent-color-gray)'" :size="25" />
            <div :title="$t('nav.search.open_dic')" class="search-box-dic"
                @click="dic_list_open = dic_list_open == true ? false : true">
                <SVGIcon :name="'book-search'" :color="'var(--accent-color)'" :size="25" />
            </div>

            <div class="search-box-dic-list" v-if="dic_list_open">
                <div v-for="(dic, index) in dicListObject" class="search-box-dic-list-checkbox" @click="checkDic(index)">
                    <SVGIcon :name="hasDic(index) ? 'checkbox-outline' : 'checkbox-blank-outline'"
                        :color="'var(--accent-color)'" :size="25" />
                    <span>{{ dic }}</span>
                </div>
            </div>
        </div>
        <div class="search-btn" @click="open_search"><span>{{ $t('nav.search.find') }}</span></div>
    </div>
</template>

<script>
import { defineComponent, provide, ref, onMounted, onUnmounted, computed } from 'vue';

export default defineComponent({
    name: 'Search',
    props: {
        search: {
            type: String,
            required: false,
            default: ''
        },
        selectedDic: {
            type: Object,
            required: false,
            default: {}
        }
    },
    setup(props, { emit }) {

        const dic_list_open = ref(false);
        const selectedDic = ref(props.selectedDic)
        const search_tmp = ref(props.search)
        const box_error = ref(false);

        function inputHandler(event) {
            const element = event.target
            search_tmp.value = element?.value;
            emit('update:search', element?.value)
            box_error.value = false;
        }



        function open_search() {
            if (search_tmp.value == '') {
                box_error.value = true;
            } else {
                box_error.value = false;
                emit('open_search')
            }

        }

        // Функция для проверки наличия элемента по ключу
        function hasDic(key) {
            return key in selectedDic.value;
        }

        function checkDic(key) {
            if (!hasDic(key)) {
                selectedDic.value[key] = true;
            } else {
                delete selectedDic.value[key];
            }
            emit('update:selectedDic', selectedDic.value)
        }

        const screenWidth = ref(window.innerWidth);

        const handleResize = () => {
            screenWidth.value = window.innerWidth;
        };

        onMounted(() => {
            window.addEventListener('resize', handleResize);
        });

        onUnmounted(() => {
            window.removeEventListener('resize', handleResize);
        });
        const selectedDic_l = computed(() => {

            var list = [];

            var i = 0;

            var max = 2;
            if (screenWidth.value <= 768) {
                max = 1;
            }

            for (const key in selectedDic.value) {
                if (i < max) {
                    list.push(dicListObject[key])
                }
                i++;
            }
            i -= max;
            if (i > 0) {
                list.push("+" + i)
            }
            return list;
        })


        const dicListObject = {
            dic_jardic: "Jardic",
            dic_warodai: "Warodai",
            dic_yarxi: "ЯРКСИ",
            dic_bkrs: "БКРС",
            dic_edict: "Edict",
            dic_enamdict: "Enamdict",
            dic_kanjidic: "Kanjdic",
            dic_unihan: "Unihan",
            dic_tatoeba: "Tatoeba",
            dic_chekhov: "Чехов",
            dic_japaneselaw: "Laws of Japan",
            dic_medic: "Medic",
            dic_stories: "Stories"
        };


        function clear_input() {
            this.$refs["query"].value = "";
            search_tmp.value = ''
            emit('update:search', '')
        }




        return {
            inputHandler,
            open_search,
            dic_list_open,
            dicListObject,
            hasDic,
            checkDic,
            screenWidth,
            selectedDic_l,
            selectedDic,
            clear_input,
            search_tmp,
            box_error
        }
    }
})

</script>

<style scoped lang="scss">
.search {

    display: flex;
    gap: 4px;

    &-box {

        &.error {
            box-shadow: 0px 0px 7px 9px rgba(231, 76, 60, 0.2);
        }

        margin-left: 30px;
        min-width: 650px;
        width: auto;
        height: 36px;
        border-radius: 20px;
        border: 2px solid var(--accent-color);
        display: flex;
        align-items: center;
        // overflow: hidden;
        background-color: var(--main-background-color);
        position: relative;

        &-img {
            margin-left: 8px;
        }

        & input {
            height: auto;
            width: 100%;
            border: none;
            margin-left: 5px;
            outline: none;
            font-family: 'Noto Sans', 'Noto Sans JP', serif;
            font-size: 16px;
            color: var(--text-color);
            background-color: var(--main-background-color);
        }

        &-dic {
            user-select: none;
            cursor: pointer;
            margin-right: 10px;

            &:hover {
                & .icon-svg {
                    background-color: var(--accent-color-hover);
                }
            }

            &-list {
                position: absolute;
                top: 40px;
                right: 0;
                // width: calc(100% - 40px);
                height: 150px;
                background-color: var(--cards-background-color);
                box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.25);
                border-radius: 20px;
                z-index: 200;
                padding: 10px 20px;

                display: grid;
                grid-template-columns: 1fr 1fr 1fr 1fr;
                gap: 8px;

                &-checkbox {
                    display: flex;
                    gap: 4px;
                    align-items: center;
                    cursor: pointer;
                    height: min-content;
                }
            }
        }

        &-sel-list {

            display: flex;
            gap: 4px;

            & .elem {
                background-color: var(--accent-color);
                color: #fff;
                font-size: 12px;
                border-radius: 3px;
                padding: 2px 4px;
                max-width: 65px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }

        }

    }

    &-btn {
        height: 40px;
        width: 100px;
        background-color: var(--accent-color);
        color: white;
        display: flex;
        border-radius: 20px;
        cursor: pointer;

        & span {
            margin: auto;

        }

        &:hover {
            background-color: var(--accent-color-hover);
        }
    }
}


@media screen and (max-width: 1023px) {

    .search {
        width: 100%;
        position: relative;

        &-box {
            margin-left: 0px;
            min-width: calc(100% - 48px);

            &-img {
                display: none;
            }

            & input {
                margin-left: 13px;
            }

            position: unset;

            &-dic {
                &-list {
                    top: 45px;
                    // padding: 10px 10px;
                    height: auto;

                    grid-template-columns: 1fr 1fr;
                    gap: 8px;

                    &-checkbox span {
                        max-width: 80px;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                    }
                }
            }
        }

        &-btn {
            width: 40px;
            position: relative;


            & span {
                display: none;
            }

            &::after {
                content: '';
                margin: auto;
                mask-repeat: no-repeat;
                -webkit-mask-repeat: no-repeat;
                mask-size: contain;
                -webkit-mask-size: contain;
                mask-position: center;
                -webkit-mask-position: center;
                min-width: 20px;
                min-height: 20px;
                max-width: 20px;
                max-height: 20px;
                mask-image: url('@/assets/icons/SearchOutlineBlack.svg');
                -webkit-mask-image: url('@/assets/icons/SearchOutlineBlack.svg');
                background-color: white
            }
        }


    }
}
</style>
