<template>
<div class="menu">
    <el-row style="border-bottom: 1px solid #eee; border-right: 1px solid #eee;">
        <h4 id="text"><i class="el-icon-tickets"></i> 我的错题本</h4>
    </el-row>
    <el-row class="menu-content">
        <el-menu
            @select="handleSelect"
            background-color="#ffffff">
            <el-menu-item 
                v-for="book in books" 
                :index="book._id"
                :key="book._id">
                <i class="el-icon-document"></i>
                <span slot="title">错题本 {{book.name}}</span>
            </el-menu-item>
        </el-menu>
    </el-row>
    <el-row class="bottom">
        <span>
            <el-button type="primary" icon="el-icon-plus" circle @click="createFormVisible = true"></el-button>
            <el-dialog 
                title="创建错题本" 
                :visible.sync="createFormVisible" 
                width="30%" 
                :center="true"
                @close="close('newBookForm')">
                <el-form :model="form" ref="newBookForm">
                    <el-form-item label="错题本名称" label-width="120px" 
                        prop="name" 
                        :rules="[
                            {required: true, message: '名称不能为空'}
                        ]">
                        <el-input v-model="form.name" autocomplete="off"></el-input>
                    </el-form-item>
                    
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" class="btn" @click="addBook('newBookForm')">确认</el-button>
                    <el-button class="btn" @click="createFormVisible = false">取消</el-button>
                </div>
            </el-dialog>
        </span>
    </el-row>
</div>
</template>

<script>
    import api from '../axios'
    export default {
        name: 'side',
        data() {
            return {
                createFormVisible: false,
                form: {
                    name: ''
                },
                reRender: false,
                selected: ''
            };
        },
        created() {
            this.$store.dispatch('GetBooks', localStorage.getItem('username'));
        },
        computed: {
            books: function() {
                return this.$store.state.books;
            }
        },
        methods: {
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
                this.selected = key;
                let token = localStorage.getItem('token');
                this.$emit('select', key);
            },
            addBook(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        console.log('added new book!');
                        let newBook = {
                            name: this.form.name,
                            user: localStorage.getItem('username')
                        }
                        this.$store.dispatch('AddBook', newBook);
                        this.createFormVisible = false;
                    } else {
                        console.log('error submit!');
                    }
                })
            },
            close(formName) {
                this.$refs[formName].resetFields();
            }  
        }
    }
</script>

<style>
    .menu {
        text-align: center;
    }

    .menu-content {
        height: -webkit-fill-available;
        overflow: scroll;
        border-right: 1px solid #eee;
    }

    .bottom {
        border-top: 1px solid #eee;
        border-right: 1px solid #eee;
        border-bottom: 1px solid #eee;
        padding: 20px 0;
    }
</style>