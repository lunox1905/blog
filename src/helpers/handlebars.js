module.exports = {
    sum: (a, b) => a + b,
    tags: (tags) => {
        var html = ''
        if(tags == undefined) return html
        tags.map(tag => {
            html += `<li class="post-tag">${tag}</li>`
        }).join(' ')
        return html
    },
    rating: (rating) => {
        rating = Math.round(rating)
        let htmls = ''
        for(let i = 0; i < rating; ++i) {
            htmls += `<div class="rating"><i class="isRating fas fa-star"></i></div>`
        }
       
        for(let i = rating; i < 5; ++i) {
            htmls += `<div class="rating"><i class="fas fa-star"></i></div>`
        }
      
        return htmls
    },
    time: (time) => {
        const d = new Date(time) 
        return `${d.getDate()}-${d.getMonth()}-${d.getFullYear()}`
    },
    ifRole: (v1, v2, options) => {
        if(v1 === v2) {
            return options.fn(this);
        }
         return options.inverse(this);
    },
    checkRole: (role, i) => {
        let htmls = ''
        if(role == 'admin')
        htmls = `
        <td>
            <input type="checkbox" class="d[${i}]" checked="checked" name="role" value="admin">
        </td>
        <td>
            <input type="checkbox" class="d[${i}]" name="role" value="browse">
        </td>
        <td>
            <input type="checkbox" class="d[${i}]" name="role" value="user">
        </td>`
        if(role == 'browse') {
            htmls = `
            <td>
                <input type="checkbox" class="d[${i}]" name="role" value="admin">
            </td>
            <td>
                <input type="checkbox" class="d[${i}]" checked="checked"  name="role" value="browse">
            </td>
            <td>
                <input type="checkbox" class="d[${i}]" name="role" value="user">
            </td>`
        }
        if(role == 'user') {
            htmls = `<td>
                <input type="checkbox" class="d[${i}]" name="role" value="admin">
            </td>
            <td>
                <input type="checkbox" class="d[${i}]" name="role" value="browse">
            </td>
            <td>
                <input type="checkbox" class="d[${i}]" name="role" value="user" checked>
            </td>`
        }
        return htmls
    },
    comments: (comments, avatar) => {
        let htmls = ''
        if(comments == undefined) return htmls
        comments.map((comment) => {
            htmls += `
                <div class="comment-item">
                    <div class="comment-box">
                        <div class="comment-avatar" herf>
                            <img src="${comment.idUser.avatar}" alt="">
                        </div>
                        <div class="comment-body">
                            <h5 class="comment-user">${comment.idUser.name}</h5>
                            <p class="comment-content">${comment.content}</p>
                            <div class="reply"><i class="fas fa-reply"></i>Trả lời</div>
                        </div>
                    </div>
                    <div class="container-comment hide"> 
                        <img src="${avatar}" alt=""> 
                        <div class="comment-box-writer">
                            <div class="writer-comment" placeholder="Viết bình luận" contenteditable=""></div>
                            <button class="btn-submit comment-btn">Gửi</button>
                        </div>
                    </div>
                </div>    
            `
        }).join(' ')
        return htmls
    },
    pagination: (currentPage, totalPage, size, options)=>{
        var startPage, endPage, context;
        currentPage = parseInt(currentPage)
        if (arguments.length === 3) {
        options = size;
        size = 5;
        }
    
        startPage = currentPage - Math.floor(size / 2);
        endPage = currentPage + Math.floor(size / 2);
    
        if (startPage <= 0) {
        endPage -= (startPage - 1);
        startPage = 1;
        }
    
        if (endPage > totalPage) {
        endPage = totalPage;
        if (endPage - size + 1 > 0) {
            startPage = endPage - size + 1;
        } else {
            startPage = 1;
        }
        }
    
        context = {
        startFromFirstPage: false,
        pages: [],
        endAtLastPage: false,
        max: totalPage
        };
        if (startPage === 1) {
        context.startFromFirstPage = true;
        }
        for (var i = startPage; i <= endPage; i++) {
        context.pages.push({
            page: i,
            isCurrent: i === currentPage,
        });
        }
        if (endPage === totalPage) {
        context.endAtLastPage = true;
        }
    
        return options.fn(context);
    }

}