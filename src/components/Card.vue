<template lang="html">
<el-card class="box-card" shadow="hover">
    <div slot="header" class="clearfix">
        <span style="font-size: 20px; font-weight: bold;">{{title}}</span>
        <el-tooltip content="删除" placement="top">
            <el-button style="float: right; padding: 3px 10px;" type="text" @click="deleteFormVisible = true">
                <i class="el-icon-delete"></i>
            </el-button>
        </el-tooltip>
        <el-dialog 
            title="删除错题" 
            :visible.sync="deleteFormVisible" 
            width="30%" 
            :center="true">
            <span><i class="el-icon-warning"></i> 确认要删除该错题吗?</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" class="btn" @click="deleteProblem">确认</el-button>
                <el-button class="btn" @click="deleteFormVisible = false">取消</el-button>
            </span>
        </el-dialog>
        <el-tooltip content="编辑" placement="top">
            <el-button style="float: right; padding: 3px 10px; margin-left: 10px;" type="text" @click="editFormVisible = true">
                <i class="el-icon-edit"></i>
            </el-button>
        </el-tooltip>
        <el-dialog 
            title="编辑错题" 
            :visible.sync="editFormVisible"
            @close="reRender = !reRender" 
            width="60%" 
            v-if="reRender">
            <create key="create1" :isCreate="false" :oldForm="this.post" @submitForm="editProblem" @cancelCreate="editFormVisible = false"></create>
        </el-dialog>
        <el-dialog 
            title="编辑错题" 
            :visible.sync="editFormVisible"
            @close="reRender = !reRender" 
            width="60%" 
            v-else>
            <create key="create2" :isCreate="false" :oldForm="this.post" @submitForm="editProblem" @cancelCreate="editFormVisible = false"></create>
        </el-dialog>
        <el-tooltip content="收藏" placement="top">
            <el-button style="float: right; padding: 3px 0;" type="text" @click="changeFavourite">
                <i v-if="favourite" class="el-icon-star-on"></i>
                <i v-else class="el-icon-star-off"></i>
            </el-button>
        </el-tooltip>
    </div>
    <h5>创建日期: {{date}}</h5>
    <h4>题目</h4>
        <div class="text item content" v-html="problem">
            <!-- {{problem}} -->
        </div>
    <h4>答案</h4>
        <div v-if="!quizMode" class="text item content" v-html="answer">
            <!-- {{answer}} -->
        </div>
        <div v-else class="text item">
            <div v-if="!showAnswer" class="text item">
                <el-button :plain="true" @click="showAnswer = true">显示答案</el-button>
            </div>
            <div v-else class="text item">
                <div v-html="answer" class="content"></div>
                <el-button :plain="true" @click="showAnswer = false">隐藏答案</el-button>
            </div>
        </div>
</el-card>
</template>

<script>
    import create from './Create.vue'
    import api from '../axios.js'
    import moment from 'moment'

    export default {
        name: 'card',
        components: {
            create
        },
        props: {
            problemId: '',
            quizMode: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                deleteFormVisible: false,
                editFormVisible: false,
                post: '',
                reRender: false,
                showAnswer: !this.quizMode,
            }
        },
        created() {
            this.getProblem();
        },
        computed: {
            title: function() {
                return this.post.title;
            },
            collections: function() {
                return this.post.collections;
            },
            favourite: function() {
                return this.post.favourite;
            },
            problem: function() {
                return this.post.problem;
            },
            answer: function() {
                return this.post.answer;
            },
            date: function() {
                return moment(this.post.date).format("dddd, MMMM Do YYYY, h:mm:ss a");
            }
        },
        methods: {
            getProblem() {
                let obj = {_id: this.problemId};
                api.getProblem(obj).then(({
                    data
                }) => {
                    if (data.code == 401) {
                    console.log('token');
                    
                } else {
                    // console.log(data);
                    this.post = data;
                    }
                });
            },
            deleteProblem() {
                console.log('deleted problem!');
                this.$emit('delete', this.problemId);
                this.deleteFormVisible = false;
            },
            editProblem(form) {
                console.log('edited problem!');
                this.editFormVisible = false;
                form['_id'] = this.problemId;
                api.editProblem(form).then(({
                    data
                }) => {
                    if (data.code == 401) {
                        console.log('token');
                    } else {
                        if (data.success) {
                            this.$message({
                                type: 'success',
                                message: '编辑成功'
                            })
                            this.getProblem();
                        }
                    }
                })
                this.$emit('edit');
            },
            changeFavourite() {
                let obj = {
                    _id: this.problemId,
                    favourite: !this.favourite};
                api.changeFavourite(obj);
                console.log('changed favourite!')
                this.getProblem();
            },
            updatePost(newPost) {
                console.log('updated post!');
            }
        }
    }
</script>

<style scoped>
    .item {
        /* margin-bottom: 18px; */
        width: 100%;
        word-break: break-all;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
    }

    .box-card {
        width: 99%;
    }
</style>

<style>
    .content table {
    border-top: 1px solid #ccc;
    border-left: 1px solid #ccc;
    }

    .content table td,
    .content table th {
    border-bottom: 1px solid #ccc;
    border-right: 1px solid #ccc;
    padding: 3px 5px;
    }

    .content table th {
    border-bottom: 2px solid #ccc;
    text-align: center;
    }

    /* blockquote 样式 */
    .content blockquote {
    display: block;
    border-left: 8px solid #d0e5f2;
    padding: 5px 10px;
    margin: 10px 0;
    line-height: 1.4;
    font-size: 100%;
    background-color: #f1f1f1;
    }

    /* code 样式 */
    .content code {
    display: inline-block;
    *display: inline;
    *zoom: 1;
    background-color: #f1f1f1;
    border-radius: 3px;
    padding: 3px 5px;
    margin: 0 3px;
    }

    .content pre code {
    display: block;
    }

    /* ul ol 样式 */
    .content ul, ol {
    margin: 10px 0 10px 20px;
    }

    .content img {
        max-width: 1000px;
        max-height: 600px;
    }
</style>