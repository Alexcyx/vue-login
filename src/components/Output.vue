<template>
    <el-container direction="vertical" class="container">
        <div style="width: 60%; align-self: center;">
            <el-row class="step">
                <el-steps :active="active" finish-status="success">
                    <el-step title="步骤 1"></el-step>
                    <el-step title="步骤 2"></el-step>
                    <el-step title="步骤 3"></el-step>
                </el-steps>
            </el-row>
            <el-row type="flex" justify="center" style="padding: 24px">
                <div v-show="active === 0">
                    <h3>请选择要导出的错题本：</h3>
                    <el-transfer v-model="selected" 
                        :data="books" 
                        :titles="['未选择错题本', '已选择错题本']"></el-transfer>
                </div>
                <div v-show="active === 1">
                    <div>
                        <h3>请选择日期范围：</h3>
                        <el-date-picker
                            v-model="value"
                            type="daterange"
                            align="right"
                            unlink-panels
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :picker-options="pickerOptions">
                        </el-date-picker>
                    </div>
                </div>
                <div v-show="active === 2">
                    <h3>其它选项：</h3>
                    <el-switch
                        v-model="favourite"
                        active-text="仅导出收藏的错题"
                        inactive-text="导出所有错题" 
                        style="padding: 24px 0">
                    </el-switch>
                    <br>
                    <el-switch
                        v-model="answer"
                        active-text="导出答案"
                        inactive-text="仅导出题目">
                    </el-switch>
                </div>
                <div v-show="active === 3" style="width: -webkit-fill-available">
                    <!-- <canvas id="output" width="1000px" height="1000px"></canvas> -->
                    <el-alert
                        title="没有符合条件的错题，请返回重试！"
                        type="error"
                        show-icon 
                        v-show="err">
                    </el-alert>
                </div>
            </el-row>
            <el-row type="flex" justify="center" style="padding: 24px">
                <el-button type="primary" v-show="active > 0" @click="active--">上一步</el-button>
                <el-button type="primary" v-show="active < 3" @click="active++">下一步</el-button>
                <el-button type="primary" v-show="active === 3" @click="finish">导出错题</el-button>
            </el-row>
        </div>
    </el-container>
</template>

<script>
    import api from '../axios.js'
    import html2canvas from 'html2canvas';

    export default {
        data() {
            const generateData = _ => {
                const data = [];
                this.$store.state.books.forEach(book => {
                    data.push({
                        key: book._id,
                        label: book.name
                    })
                })
                return data;
            };
            return {
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                active: 0,
                selected: [],
                books: generateData(),
                value: '',
                favourite: false,
                answer: true,
                err: false
            };
        },
        created() {
            this.$store.dispatch('GetBooks', localStorage.getItem('username'));
        },
        methods: {
            finish() {
                let obj = {
                    date1: this.value[0],
                    date2: this.value[1],
                    collections: [...this.selected],
                    favourite: this.favourite,
                    answer: this.answer
                }
                api.getPDF(obj).then(({
                    data
                }) => {
                    if (data.success) {
                        var canvas = document.getElementById("output");
                        data.documents.forEach(doc => {
                            var html_string = doc.problem;
                            var iframe=document.createElement('iframe');
                            document.body.appendChild(iframe);
                            setTimeout(function(){
                                var iframedoc=iframe.contentDocument||iframe.contentWindow.document;
                                iframedoc.body.innerHTML=html_string;
                                html2canvas(iframedoc.body, {width: 1000, height: 1000}).then(function(canvas) {
                                    document.body.appendChild(canvas);
                                    document.body.removeChild(iframe);
                                })
                            }, 10);
                        })
                    } else {
                        this.err = true;
                    }
                })
            }
        },
        watch: {
            active: function(newValue, oldValue) {
                if (newValue === 1 && oldValue === 0) {
                    if (this.selected.length == 0) {
                        this.active = 0;
                        this.$alert('请选择至少一本错题本', '错误', {
                            confirmButtonText: '确定',
                        });
                    }
                }
                if (newValue === 2 && oldValue === 3) {
                    this.err = false;
                }
            }
        }
    }
</script>

<style>
    .container {
        border: 1px solid #eee;
    }

    .step {
        width: 100%;
        padding: 24px;
    }
</style>