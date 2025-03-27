// 全局变量
const API_BASE = 'https://你的云开发环境ID.service.tcloudbase.com/';
const CLOUD_ENV = '你的云开发环境ID'; // 云开发环境ID

// 判断当前页面
const currentPage = window.location.pathname.split('/').pop();

// 页面加载时执行
document.addEventListener('DOMContentLoaded', function() {
    // 检查用户是否已登录（除了登录页面）
    if (currentPage !== 'login.html') {
        checkLoginStatus();
    }
    
    // 根据不同页面执行不同的初始化函数
    switch (currentPage) {
        case 'login.html':
            initLoginPage();
            break;
        case 'index.html':
            initIndexPage();
            break;
        case 'edit.html':
            initEditPage();
            break;
    }
});

// 初始化登录页面
function initLoginPage() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            
            // 简单验证
            if (!username || !password) {
                alert('请输入用户名和密码');
                return;
            }
            
            // 这里用一个简单的方式进行验证，实际项目中应使用加密和服务器验证
            // 假设我们暂时硬编码一个管理员账号（实际项目中应从服务器验证）
            if (username === 'admin' && password === 'password123') {
                // 保存登录状态到本地存储
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', username);
                
                // 跳转到首页
                window.location.href = 'index.html';
            } else {
                alert('用户名或密码错误');
            }
        });
    }
}

// 初始化文章列表页
function initIndexPage() {
    // 获取登出按钮并添加事件监听
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // 显示用户名
    const usernameDisplay = document.getElementById('username-display');
    if (usernameDisplay) {
        usernameDisplay.textContent = localStorage.getItem('username') || '管理员';
    }
    
    // 加载文章列表
    loadArticles();
}

// 初始化编辑页面
function initEditPage() {
    // 文件上传区域点击事件
    const fileUploadArea = document.getElementById('fileUploadArea');
    const fileInput = document.getElementById('articleFile');
    const fileInfo = document.getElementById('fileInfo');
    
    if (fileUploadArea && fileInput) {
        fileUploadArea.addEventListener('click', () => fileInput.click());
        
        fileInput.addEventListener('change', function() {
            if (this.files.length > 0) {
                const file = this.files[0];
                fileInfo.innerHTML = `
                    <strong>${file.name}</strong>
                    <div>${(file.size / 1024).toFixed(2)} KB</div>
                `;
                fileInfo.style.display = 'block';
            }
        });
    }
    
    // 图片上传预览
    const imageUploadArea = document.getElementById('imageUploadArea');
    const imageInput = document.getElementById('coverImage');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    const imagePreview = document.getElementById('coverImagePreview');
    const removeImageBtn = document.getElementById('removeImageBtn');
    
    if (imageUploadArea && imageInput) {
        imageUploadArea.addEventListener('click', () => imageInput.click());
        
        imageInput.addEventListener('change', function() {
            if (this.files.length > 0) {
                const file = this.files[0];
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        imagePreview.src = e.target.result;
                        imagePreviewContainer.style.display = 'block';
                    }
                    reader.readAsDataURL(file);
                }
            }
        });
        
        if (removeImageBtn) {
            removeImageBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                imagePreview.src = '';
                imagePreviewContainer.style.display = 'none';
                imageInput.value = '';
            });
        }
    }
    
    // 表单提交
    const articleForm = document.getElementById('articleForm');
    if (articleForm) {
        articleForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 收集表单数据
            const formData = {
                title: document.getElementById('title').value,
                category: document.getElementById('category').value,
                tag: document.getElementById('tag').value,
                excerpt: document.getElementById('excerpt').value,
                content: document.getElementById('content').value,
                author: document.getElementById('author').value,
                readTime: document.getElementById('readTime').value,
                // 文件和图片通过单独的方式上传
            };
            
            // 简单验证
            if (!formData.title || !formData.excerpt || !formData.content) {
                alert('请填写必填字段');
                return;
            }
            
            // 保存文章（这里只是模拟）
            alert('文章保存成功（演示）');
            
            // 实际项目中，这里应该调用API保存数据
            // saveArticle(formData);
        });
        
        // 取消按钮
        const cancelBtn = document.getElementById('cancel-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', function() {
                if (confirm('确定取消编辑？未保存的内容将会丢失。')) {
                    window.location.href = 'index.html';
                }
            });
        }
        
        // 保存草稿按钮
        const draftBtn = document.getElementById('draft-btn');
        if (draftBtn) {
            draftBtn.addEventListener('click', function() {
                alert('草稿保存成功（演示）');
            });
        }
    }
    
    // 检查是否是编辑现有文章
    const articleId = getParameterByName('id');
    if (articleId) {
        // 这里应该从API获取文章数据并填充表单
        document.getElementById('page-title').textContent = '编辑文章';
        // loadArticleData(articleId);
    }
}

// 检查用户登录状态
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        // 未登录则重定向到登录页
        window.location.href = 'login.html';
    }
}

// 退出登录
function logout() {
    // 清除登录状态
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    
    // 重定向到登录页
    window.location.href = 'login.html';
}

// 加载文章列表
function loadArticles() {
    const tableBody = document.getElementById('articles-table-body');
    
    if (!tableBody) return;
    
    // 这里应该从API获取文章列表，目前我们使用示例数据
    const articles = [
        {
            id: 1,
            title: '新拟物设计在移动端的实践指南',
            category: '美文摘要',
            date: '2023-08-15',
            downloadCount: 42
        },
        {
            id: 2,
            title: '特种纸张选择指南',
            category: '高中阅读',
            date: '2023-08-14',
            downloadCount: 28
        },
        {
            id: 3,
            title: '中文可变字体技术突破',
            category: '四六级考',
            date: '2023-08-13',
            downloadCount: 35
        }
    ];
    
    // 生成表格内容
    if (articles.length > 0) {
        let html = '';
        
        articles.forEach(article => {
            html += `
                <tr>
                    <td>${article.title}</td>
                    <td>${article.category}</td>
                    <td>${article.date}</td>
                    <td>${article.downloadCount}</td>
                    <td>
                        <a href="edit.html?id=${article.id}" class="btn btn-sm btn-outline">
                            <i class="fas fa-edit"></i> 编辑
                        </a>
                        <button class="btn btn-sm btn-outline delete-btn" data-id="${article.id}">
                            <i class="fas fa-trash"></i> 删除
                        </button>
                    </td>
                </tr>
            `;
        });
        
        tableBody.innerHTML = html;
        
        // 添加删除按钮事件
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                if (confirm('确定要删除这篇文章吗？')) {
                    // 这里应该调用API删除文章
                    alert(`文章ID:${id} 已删除（演示）`);
                    this.closest('tr').remove();
                }
            });
        });
    } else {
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center">暂无文章</td></tr>';
    }
}

// 辅助函数：获取URL参数
function getParameterByName(name) {
    const url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
} 