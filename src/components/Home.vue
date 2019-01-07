<template lang="html">
<div class="home">
    <el-container>
        <el-aside width="200px">
            <side @select="chooseBook"></side>
        </el-aside>
        <el-main>
            <el-row>
                <h2><i class="el-icon-document"></i> 错题本：{{bookName}}</h2>
                <el-button type="danger" class="btn" @click="selectedBook('deleteFormVisible')">删除错题集</el-button>
                <el-dialog 
                    title="删除错题集" 
                    :visible.sync="deleteFormVisible" 
                    width="30%"  
                    :center="true">
                    <span><i class="el-icon-warning"></i> 确认要删除该错题本吗</span>
                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="deleteBook">确认</el-button>
                        <el-button @click="deleteFormVisible = false">取消</el-button>
                    </span>
                </el-dialog>
                <el-button type="primary" class="btn" @click="selectedBook('createFormVisible')">添加错题</el-button>
                <el-dialog 
                    title="添加错题" 
                    :visible.sync="createFormVisible"
                    @close="reRender = !reRender" 
                    width="50%" 
                    v-if="reRender">
                    <create key="create1" @submitForm="createProblem" @cancelCreate="createFormVisible = false"></create>
                </el-dialog>
                <el-dialog 
                    title="添加错题" 
                    :visible.sync="createFormVisible" 
                    @close="reRender = !reRender" 
                    width="50%" 
                    v-else>
                    <create key="crerate2" @submitForm="createProblem" @cancelCreate="createFormVisible = false"></create>
                </el-dialog>
                <div class="btn">
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
            </el-row>
            <el-row>
                <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="预览错题" name="first">
                    <div v-if="book" class="content">
                        <div v-for="problem in problems" :key="problem._id" class="card">
                            <transition name="el-fade-in">
                                <card v-show="show" :problemId="problem._id" @delete="deleteProblem" @edit="refresh"></card>
                            </transition>
                        </div>
                    </div>
                    <div v-else>
                        请选择一本错题本！
                    </div>
                </el-tab-pane>
                <el-tab-pane label="答题模式" name="second">
                    <div v-if="book" class="content">
                        <div v-for="problem in problems" :key="problem._id" class="card">
                            <transition name="el-fade-in">
                                <card v-show="show" :problemId="problem" :quizMode="true" @delete="deleteProblem" @edit="refresh"></card>
                            </transition>
                        </div>
                    </div>
                    <div v-else>
                        请选择一本错题本！
                    </div>
                </el-tab-pane>
                </el-tabs>
            </el-row>
        </el-main>
    </el-container>
</div>
</template>

<script>
    import card from './Card.vue'
    import side from './Side.vue'
    import create from './Create.vue'
    import api from '../axios.js'
import { setTimeout } from 'timers';

    export default {
        name: 'home',
        components: {
            card, side, create
        },
        created() {
            this.$store.dispatch('GetBooks', localStorage.getItem('username'));
            setTimeout(() => {
                this.show = true;
            }, 200);
        },
        data() {
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
                value: '',
                activeName: 'first',
                createFormVisible: false,
                deleteFormVisible: false,
                reRender: false,
                show: false
            };
        },
        computed: {
            bookName: function() {
                if (this.book)
                    return this.book.name;
            },
            book: function() {
                return this.$store.state.book;
            },
            problems: function() {
                return this.$store.state.problems;
            }
        },
        methods: {
            createProblem(form) {
                this.createFormVisible = false;
                console.log(form);
                this.$store.dispatch('AddProblem', form);
                this.refresh();
            },
            selectedBook(visible) {
                if (this.book) {
                    if (visible === 'createFormVisible') {
                        this.createFormVisible = true;
                    } else {
                        this.deleteFormVisible = true;
                    }
                } else {
                    this.$message({
                        type: 'info',
                        message: '请选择错题本！'
                    })
                }
            },
            deleteBook() {
                this.deleteFormVisible = false;
                this.$store.dispatch('DeleteBook', this.book);
                console.log('deleted!');
                let obj = {_id: this.$store.state.books.splice(0, 1)._id};
                console.log(obj);
                this.$store.dispatch('GetBook', obj);
                this.refresh();
            },
            handleClick() {},
            chooseBook(key) {
                let obj = {_id: key};
                this.$store.dispatch('GetBook', obj);
                this.$store.dispatch('GetProblems', key);
                this.value = '';
                this.show = false;
            },
            deleteProblem(problemId) {
                console.log(problemId);
                let obj = {_id: problemId};
                api.deleteProblem(obj).then(({
                    data
                }) => {
                    if (data.code == 401) {
                        console.log('token');
                    } else {
                        if (data.success) {
                            this.$message({
                                type: 'success',
                                message: '删除问题成功'
                            })
                        } else {
                            this.$message({
                                type: 'info',
                                message: '删除失败，请稍后再试'
                            })
                        }
                    }
                })
                this.refresh();
            },
            refresh() {
                this.$store.dispatch('GetProblems', this.book._id);
                this.value = '';
                this.show = false;
            }
        },
        watch: {
            value: function(newValue, oldValue) {
                if (newValue) {
                    let problems = [];
                    let obj = {
                        collections: this.book._id,
                        date1: newValue[0],
                        date2: newValue[1] 
                    }
                    console.log(obj);
                    api.filteredProblems(obj).then(({
                        data
                    }) => {
                        if (data.code == 401) {
                            console.log('token');
                            
                        } else {
                            data.forEach(problem => {
                                problems.push(problem);
                                // console.log(data);
                            });
                        }
                    });
                    this.$store.commit('GETPROBLEMS', problems);
                } else {
                    this.$store.dispatch('GetProblems', this.book._id);
                }
            },
            show: function(newValue, oldValue) {
                if (!newValue) {
                    setTimeout(() => {
                        this.show = true;
                    }, 200);
                }
            }
        }
    };
</script>

<style scoped>
    h2 {
        margin: 0px 20px;
        float: left;
        padding-left: 20px;
    }

    .home {
        border: 1px solid #eee;
    }

    .card {
        padding-bottom: 20px;
    }

    .content {
        overflow: scroll;
        height: -webkit-fill-available;
    }

    .side-menu {
        border-top: 1px solid #eee;
    }

    .main-view {
        border-top: 1px solid #eee;
        border-left: 1px solid #eee;
    }

    .btn {
        float: right; 
        margin: 0px 10px
    }

    .dialog-footer {
        padding: 20px;
        padding-top: 10px;
        text-align: inherit;
    }
</style>
