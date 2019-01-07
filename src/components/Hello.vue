<template scope='scope'>
<div class="hello">
    <!-- <h1>{{ msg }}: {{ username }}</h1> -->
    <el-container>
        <el-header height="40px">
            <myhead :user="username" @logout="logout()"></myhead>
        </el-header>
        <el-main>
            <router-view></router-view>
        </el-main>
    </el-container>

    <!-- <br>
    <transition-group name="list-complete" tag="ul">
        <li v-for="(item, index) in user" :key="item._id" class="list-complete-item">
            {{ index+1 }}. {{ item.email }}
            <el-button type="" @click="del_user(index)">删除</el-button>
        </li>
    </transition-group>
    <br>
    <el-button type="primary" @click="logout()">登出</el-button> -->
</div>
</template>

<script>
/**
 * @author: weakgoldfish
 */
import * as types from '../store/types'
import api from '../axios'
import home from './Home.vue'
import myhead from './Header.vue'

export default {
    name: 'hello',
    components: {
        home, myhead
    },
    data() {
        return {
            msg: 'Welcome to Vue-login',
            user: '',
            username: ''
        }
    },
    mounted() {
        this.get_User()
        this.username = localStorage.getItem('username')
        this.$router.push('/home')
    },
    methods: {
        get_User() {
            setTimeout(() => {
                api.getUser().then(({
                    data
                }) => {
                    if (data.code == 401) {
                        console.log('token')
                        this.$router.push('/login')
                        this.$store.dispatch('UserLogout')
                        console.log(localStorage.token)
                    } else {
                        this.user = data
                    }
                })
            }, 100)
        },
        logout() {
            this.$store.dispatch('UserLogout')
            if (!this.$store.state.token) {
                this.$router.push('/login')
                this.$message({
                    type: 'success',
                    message: '登出成功'
                })
            } else {
                this.$message({
                    type: 'info',
                    message: '登出失败'
                })
            }
        },
        del_user(id) {
            let opt = {
                id: this.user[id]._id
            };
            api.delUser(opt).then(response => {
                console.log(response)
                this.$message({
                    type: 'success',
                    message: '删除成功'
                })
                this.get_User()
            }).catch((err) => {
                console.log(err);
            })
        }
    }
}
</script>

<style scoped>
h1,
h2 {
    font-weight: normal;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    /*display: inline-block;*/
    margin: 10px 0;
}

a {
    color: #42b983;
}

.list-complete-item {
    transition: all 1s;
    display: inline-block;
    margin-right: 10px;
}

.list-complete-enter,
.list-complete-leave-to {
    opacity: 0;
    transform: translateY(30px);
}

.list-complete-leave-active {
    position: absolute;
}

</style>
