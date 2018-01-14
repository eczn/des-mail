// Add Your Personal Helper Function 
module.exports = D => ({
    back(){
        let urls; 
        
        if (process.env.DES_MAIL_SERVER){
            urls = D.imgList().map(e => `/mail-img/${e}`); 
        } else {
            urls = D.imgList().map(e => {
                let resp = D.pusher.fromCache(e); 

                return resp.url; 
            }); 
        }

        if (urls.length % 3 !== 0){
            let r = urls.length % 3; 
            urls = urls.slice(0, urls.length - r); 
        }


        let imgs = urls.map(e => {

            return `
                <span class="bgs-img" style="background-image: url(${e});"></span>
            `
        });

        let imgPendding = urls.map(e => `<image-for-upload src="${e}"></image-for-upload>`); 

        return `
            <div class="bgs-pedding">
                <div class="bgs">${ imgs.join('') }</div>
            </div>

            ${imgPendding.join('')}
        `
    }
})
