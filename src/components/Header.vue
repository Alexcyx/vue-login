<template>
<div class="myhead">
    <el-row>
        <el-col :span="4">
            <span>LOGO goes here</span>
        </el-col>
        <el-col :span="20">
            <el-menu
                :default-active="activeIndex"
                mode="horizontal"
                @select="handleSelect">
                <el-menu-item index="1">主页</el-menu-item>
                <el-menu-item index="2">欢迎，{{user}}</el-menu-item>
                <el-menu-item index="3">登出</el-menu-item>
            </el-menu>
        </el-col>
    </el-row>
</div>
</template>

<script>
    export default {
        name: 'myhead',
        props: {
            user: {
                type: String
            }
        },
        data() {
            return {
                activeIndex: '1'
            };
        },
        methods: {
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
                if (key == 3) {
                    this.$emit('logout');
                }
            }
        }
    }
</script>

<style>
    .myhead {
        border: 1px solid  #eee;
        border-bottom-width: 0px;
    }
</style>