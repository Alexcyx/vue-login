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
            <el-input type="textarea" v-model="form.problem"></el-input>
        </el-form-item>
        <el-form-item label="答案" prop="answer">
            <el-input type="textarea" v-model="form.answer"></el-input>
        </el-form-item>
        <el-form-item label="收藏错题">
            <el-switch v-model="form.favourite"></el-switch>
        </el-form-item>
        <el-form-item label="添加照片">
            <el-upload
                class="upload-demo"
                drag
                action="https://jsonplaceholder.typicode.com/posts/"
                multiple>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit('formData')">{{isCreate ? '立即添加' : '提交修改'}}</el-button>
            <el-button @click="onCancel">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
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
                        this.form['photo'] = '/';
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