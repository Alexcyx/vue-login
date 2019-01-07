<template>
    <el-form ref="formData" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="标题" prop="title">
            <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="错题集">
            <el-select v-if="isCreate" v-model="form.collections" :placeholder="this.$store.state.book.name" disabled>
            </el-select>
            <el-select v-else v-model="form.collections" :placeholder="this.oldForm.collections">
                <el-option v-for="collection in collections" :key="collection._id" :label="collection.name" :value="collection._id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="题目" prop="problem">
            <!-- <el-input type="textarea" v-model="form.problem"></el-input> -->
            <div id="div1" class="toolbar"></div>
            <div id="div2" class="text"></div>
        </el-form-item>
        <el-form-item label="答案" prop="answer">
            <div id="div3" class="toolbar"></div>
            <div id="div4" class="text"></div>
            <!-- <el-input type="textarea" v-model="form.answer"></el-input> -->
        </el-form-item>
        <el-form-item label="收藏错题">
            <el-switch v-model="form.favourite"></el-switch>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit('formData')">{{isCreate ? '立即添加' : '提交修改'}}</el-button>
            <el-button @click="onCancel">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import E from 'wangeditor'

    export default {
        props: {
            oldForm: {
                type: Object,
                default: function() {
                    return {
                        title: '',
                        collections: '',
                        favourite: false,
                        problem: '',
                        answer: '',
                        date: ''
                    }
                }
            },
            isCreate: {
                type: Boolean,
                default: true
            }
        },
        created() {
            this.collections = this.$store.state.books;
        },
        mounted() {
            var editor1 = new E('#div1', '#div2');
            editor1.customConfig.menus = [
                'head',  // 标题
                'bold',  // 粗体
                'fontSize',  // 字号
                'fontName',  // 字体
                'italic',  // 斜体
                'underline',  // 下划线
                'strikeThrough',  // 删除线
                'link',  // 插入链接
                'list',  // 列表
                'justify',  // 对齐方式
                'quote',  // 引用
                'image',  // 插入图片
                'table',  // 表格
                'video',  // 插入视频
                'code',  // 插入代码
                'undo',  // 撤销
                'redo'  // 重复
            ];
            editor1.customConfig.onchange = (html) => {
                this.form.problem = html;
            }
            editor1.customConfig.uploadImgServer = '/api/upload';
            editor1.customConfig.uploadFileName = 'uploadedFile';
            editor1.customConfig.uploadImgHooks = {
                success: function(xhr, editor, results) {
                    var ret = [];
                    results.data.forEach((value) => {
                        ret.push(value);
                    });
                    console.log(xhr, editor, ret);
                    // this.form['photo'] = [...ret];
                }
            }
            editor1.create();
            if (!this.isCreate) {
                editor1.txt.html(this.form.problem);
            }

            var editor2 = new E('#div3', '#div4');
            editor2.customConfig.menus = [
                'head',  // 标题
                'bold',  // 粗体
                'fontSize',  // 字号
                'fontName',  // 字体
                'italic',  // 斜体
                'underline',  // 下划线
                'strikeThrough',  // 删除线
                'link',  // 插入链接
                'list',  // 列表
                'justify',  // 对齐方式
                'quote',  // 引用
                'image',  // 插入图片
                'table',  // 表格
                'video',  // 插入视频
                'code',  // 插入代码
                'undo',  // 撤销
                'redo'  // 重复
            ];
            editor2.customConfig.onchange = (html) => {
                this.form.answer = html;
            }
            editor2.customConfig.uploadImgServer = '/api/upload';
            editor2.customConfig.uploadFileName = 'uploadedFile';
            editor2.customConfig.uploadImgHooks = {
                success: function(xhr, editor, results) {
                    var ret = [];
                    results.data.forEach((value) => {
                        ret.push(value);
                    });
                    console.log(xhr, editor, ret);
                    // this.form['photo'] = [...ret];
                }
            }
            editor2.create();
            if (!this.isCreate) {
                editor2.txt.html(this.form.answer);
            }
        },
        data() {
            return {
                form: {
                    title: this.oldForm.title,
                    collections: this.oldForm.collections,
                    favourite: this.oldForm.favourite,
                    problem: this.oldForm.problem,
                    answer: this.oldForm.answer
                },
                rules: {
                    title: [
                        {required: true, message: '请输入标题', trigger: 'blur'}
                    ],
                    problem: [
                        {required: true, message: '请输入题目', trigger: 'blur'}
                    ],
                    answer: [
                        {required: true, message: '请输入答案', trigger: 'blur'}
                    ]
                },
                collections: ''
            }
        },
        methods: {
            onSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        const date = new Date();
                        if (this.isCreate) {
                            this.form['collections'] = this.$store.state.book._id;
                            this.form['date'] = date.getTime();
                        }
                        // this.form['photo'] = '/';
                        this.$emit('submitForm', this.form);
                        console.log('submit!');
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
                
            },
            onCancel() {
                this.$emit('cancelCreate');
                console.log('cancel!');
            }
        }
    }
</script>

<style scoped>
    .toolbar {
        border: 1px solid #ccc;
    }
    .text {
        border: 1px solid #ccc;
        /* height: 200px; */
        text-align:left;
    }
</style>