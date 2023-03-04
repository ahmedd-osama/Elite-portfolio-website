window.addEventListener('load', () => {
    // Global variables
    // Elements selectors
    let navItems = Array.from(document.querySelectorAll("nav .nav-item a"));
    let landingImgs = Array.from(document.querySelectorAll(".landing .img-group img"));
    // loader
    let loader = document.querySelector(".loader-container");
    loader.style.display = "none";
    // navbar
    function classTogglerGroup(array, className, event = undefined) {
        array.forEach((el) => {
            if (event) {
                el.addEventListener(event, (clickedEl) => {
                    array.forEach((el) => { el.classList.remove(className); });
                    let clickedElement = clickedEl.target;
                    clickedElement.classList.add(className);
                });
            }
            else {
                el.classList.add(className);
            }
        });
    }
    classTogglerGroup(navItems, "active", "click");
    // landing
    function indexSwicher(order) {
        let [img1, img2, img3] = landingImgs;
        if (order == 0) {
            img1.style["z-index"] = `${1}`;
            img2.style["z-index"] = `${2}`;
            img3.style["z-index"] = `${3}`;
        }
        else if (order == 1) {
            img1.style["z-index"] = `${3}`;
            img2.style["z-index"] = `${2}`;
            img3.style["z-index"] = `${1}`;
        }
        else {
            img1.style["z-index"] = `${2}`;
            img2.style["z-index"] = `${3}`;
            img3.style["z-index"] = `${1}`;
        }
    }
    let counter = 0;
    setInterval(() => {
        indexSwicher(counter);
        counter == 2 ? counter = 0 : counter++;
    }, 4000);
    // Animations
    const ScrollAnimationObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            }
            else {
                if (entry.target.getAttribute("animation-loop") == "true") {
                    entry.target.classList.remove("show");
                }
            }
        });
    });
    // hiddenElements Processing 
    const hiddenElements = document.querySelectorAll(".hidden, .hidden-below, .hidden-left, .hidden-right, .hidden-above, .hidden-fade-in, .hidden-fade-out");
    hiddenElements.forEach((el) => {
        let element = el;
        let animationDelay = element.getAttribute("animation-delay") ? element.getAttribute("animation-delay") : false;
        animationDelay ? element.style['transition-delay'] = `${animationDelay}ms` : '';
        ScrollAnimationObserver.observe(el);
    });
    // hiddenGroups Processing
    const hiddenGroups = document.querySelectorAll(".hidden-group, .hidden-group-below , .hidden-group-left , .hidden-group-right , .hidden-group-above , .hidden-group-fade-in , .hidden-group-fade-out ");
    hiddenGroups.forEach((group) => {
        let element = group;
        // getting the custom items selector if found
        let itemSelector = "";
        element.getAttribute("hidden-item-selector") ? element.getAttribute("hidden-item-selector") : Array.from(element.children).forEach((item) => { item.classList.contains("hidden-item") ? itemSelector = ".hidden-item" : ""; });
        // getting all the items of the group by the itemSelector variables
        let groupItems = [];
        itemSelector ? groupItems = element.querySelectorAll(itemSelector) : groupItems = Array.from(element.children);
        // console.log(itemSelector) 
        let animationDelay = element.getAttribute("animation-delay") ? element.getAttribute("animation-delay") : false;
        // console.log(animationDelay)
        let AnimGroupItemDelay = element.getAttribute("Group-item-delay") ? element.getAttribute("Group-item-delay") : false;
        // console.log(AnimGroupItemDelay)
        // passing the custom attriputes from the parent group to direct hidden items if found
        groupItems.forEach((item, index) => {
            itemSelector == ".hidden-item" ? "" : item.classList.add("hidden-item");
            let itemAnimationDelay = item.getAttribute("animation-delay") ? item.getAttribute("animation-delay") : false; // custom animation delay of a specific item
            // console.log( `index => ${index}`)
            item.setAttribute("animation-loop", group.getAttribute("animation-loop") == "true" ? "true" : "false");
            // assigning the animation delay for each indevidual item wheather it was a customly for the specific item or calculated by each step
            itemAnimationDelay ? item.style['transition-delay'] = `${itemAnimationDelay}ms` : animationDelay ? item.style['transition-delay'] = `${parseInt(animationDelay) + (AnimGroupItemDelay ? parseInt(AnimGroupItemDelay) * index : 100 * index)}ms` : "";
            // console.log(animationDelay?`${parseInt(animationDelay) + (AnimGroupItemDelay? parseInt(AnimGroupItemDelay)*index  : 100 * index )}ms`: "")
        });
    });
    // creating the observer
    const scrollAnimationGroupObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                if (entry.target.getAttribute("animation-group-target") && entry.target.getAttribute("animation-group-target") == "item") {
                    console.log("item");
                    entry.target.querySelectorAll(".hidden-item").forEach((item) => { item.classList.add("show"); });
                    // console.log("items detected")
                }
                else {
                    // console.log("group detected");
                    entry.target.classList.add("show");
                    entry.target.querySelectorAll(".hidden-item").forEach((item) => item.classList.add("show"));
                }
            }
            else {
                if (entry.target.getAttribute("animation-loop") == "true" && entry.target.getAttribute("animation-group-target") == "item") {
                    entry.target.classList.remove("show");
                    entry.target.querySelectorAll(".hidden-item").forEach((item) => item.classList.remove("show"));
                }
                else if (entry.target.getAttribute("animation-loop") == "true") {
                    entry.target.querySelectorAll(".hidden-item").forEach((item) => item.classList.remove("show"));
                    entry.target.classList.remove("show");
                }
            }
        });
    });
    // assiging the observer with the hidden groups
    hiddenGroups.forEach((group) => scrollAnimationGroupObserver.observe(group));
    // handling landing page animation
    document.querySelectorAll(".landing .hidden-right, .landing .hidden-left, .landing .hidden-above, .landing .hidden-below").forEach((item) => { item.classList.add("show"); });
    let imgGroupObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            let element = entry.target;
            let scroll = () => {
                element.style.transitionDuration = '50ms';
                element.style['transform'] = `translate(0px, ${-(0.8 * Math.round(document.documentElement.scrollTop))}px)`;
            };
            if (entry.isIntersecting) {
                window.addEventListener('scroll', scroll);
            }
            else {
                window.removeEventListener('scroll', scroll);
            }
        });
    });
    let imgGroup = Array.from(document.querySelectorAll('.landing .img-group'));
    imgGroup.forEach(group => imgGroupObserver.observe(group));
    /*
      main titles animation
    */
    let activeTitles = [];
    const titleObserver = new IntersectionObserver((entries => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                activeTitles.map((title) => title.element == entry.target ? title.state = true : "");
            }
            else {
                activeTitles.map((title) => title.element == entry.target ? title.state = false : "");
            }
        });
    }));
    const subTitleLines = Array.from(document.querySelectorAll('.main-title .sub-title-container'));
    subTitleLines.forEach((element) => {
        let elementObject = new Object;
        elementObject = {
            element: element,
            state: false
        };
        activeTitles.push(elementObject);
        titleObserver.observe(element);
    });
    document.addEventListener('scroll', () => {
        activeTitles.forEach((title) => {
            if (title.state) {
                let percentageFromTop = title.element.getBoundingClientRect().top / window.innerHeight;
                let percentage = Math.abs(percentageFromTop - 1);
                percentage = Math.round(percentage * 100);
                title.element.querySelectorAll('.line-left .filler, .line-right .filler').forEach((line) => line.setAttribute('style', `width: ${percentage}%; min-width: 20px`));
            }
        });
    });
    /*
      Portfolio
    */
    let allPortElements = [];
    let allPortData = [
        { title: 'Art Piece', description: 'the best art work in the market provided by Brush. Made by Industries top artisits', imgPath: 'images/work/1.jpg', infoPath: 'images/work/1.jpg', filterClasses: ['recent', 'modern'], badges: [{ text: 'recent', bg: 'blue-light' }] },
        { title: 'Art Piece', description: 'the best art work in the market provided by Brush. Made by Industries top artisits', imgPath: 'images/work/2.jpg', infoPath: 'images/work/2.jpg', filterClasses: ['recent', 'modern'], badges: [{ text: 'recent', bg: 'blue-light' }] },
        { title: 'Art Piece', description: 'the best art work in the market provided by Brush. Made by Industries top artisits', imgPath: 'images/work/3.jpg', infoPath: 'images/work/3.jpg', filterClasses: ['recent', 'modern'], badges: [{ text: 'recent', bg: 'blue-light' }] },
        { title: 'Art Piece', description: 'the best art work in the market provided by Brush. Made by Industries top artisits', imgPath: 'images/work/4.jpg', infoPath: 'images/work/4.jpg', filterClasses: ['modern'], badges: [] },
        { title: 'Art Piece', description: 'the best art work in the market provided by Brush. Made by Industries top artisits', imgPath: 'images/work/5.jpg', infoPath: 'images/work/5.jpg', filterClasses: ['recent', 'modern'], badges: [{ text: 'recent', bg: 'blue-light' }, { text: 'Awarded', bg: 'success' }] },
        { title: 'Art Piece', description: 'the best art work in the market provided by Brush. Made by Industries top artisits', imgPath: 'images/work/7.png', infoPath: 'images/work/7.png', filterClasses: ['vector'], badges: [] },
        { title: 'Art Piece', description: 'the best art work in the market provided by Brush. Made by Industries top artisits', imgPath: 'images/work/6.png', infoPath: 'images/work/6.png', filterClasses: ['retro'], badges: [] },
        { title: 'Art Piece', description: 'the best art work in the market provided by Brush. Made by Industries top artisits', imgPath: 'images/work/1.jpg', infoPath: 'images/work/1.jpg', filterClasses: ['vector'], badges: [] },
        { title: 'Art Piece', description: 'the best art work in the market provided by Brush. Made by Industries top artisits', imgPath: 'images/work/2.jpg', infoPath: 'images/work/2.jpg', filterClasses: ['retro'], badges: [] },
        { title: 'Art Piece', description: 'the best art work in the market provided by Brush. Made by Industries top artisits', imgPath: 'images/work/3.jpg', infoPath: 'images/work/3.jpg', filterClasses: ['retro'], badges: [] },
        { title: 'Art Piece', description: 'the best art work in the market provided by Brush. Made by Industries top artisits', imgPath: 'images/work/4.jpg', infoPath: 'images/work/4.jpg', filterClasses: ['modern'], badges: [] },
        { title: 'Art Piece', description: 'the best art work in the market provided by Brush. Made by Industries top artisits', imgPath: 'images/work/5.jpg', infoPath: 'images/work/5.jpg', filterClasses: ['vector'], badges: [] },
    ];
    function PortItemsInit() {
        for (let i = 0; i < allPortData.length; i++) {
            let itemData = allPortData[i];
            let filters = itemData.filterClasses;
            let title = itemData.title;
            let description = itemData.description;
            let imgPath = itemData.imgPath;
            let infoPath = itemData.infoPath;
            // badges
            let badges = '';
            if (itemData.badges) {
                for (let i = 0; i < itemData.badges.length; i++) {
                    badges = badges + `<span class="badge bg-${itemData.badges[i].bg}">${itemData.badges[i].text}</span>`;
                }
            }
            let item = document.createElement('div');
            // fetching filters and assiging classes
            for (let i = 0; i < filters.length; i++) {
                item.classList.add(`filter-${filters[i]}`);
            }
            item.classList.add('col-md-6', 'col-lg-4', 'position-relative', 'portfolio-item');
            item.innerHTML = `
            <div class="portfolio-wrap">
            <div class="badges">${badges ? badges : ''}</div>
              <img src="${imgPath}" alt="" class="img-fluid">
              <div class="item-info position-absolute">
                <h4>${title}</h4>
                <p>${description}</p>
                <div class="item-options mt-auto">
                  <a href="${imgPath}" data-gallery="portfolio" class="portfolio-lightbox btn btn-small py-1 px-2 me-2 text-white btn-blue-light portfolio-lightbox" title="Art Paint"><i class="fa-solid fa-eye me-1"></i> Preview</a>
                  <a href = "${infoPath}"title="info"class='btn btn-small py-1 px-2 me-2 text-white btn-blue-light'><i class="fa-solid fa-arrow-up-right-from-square me-1"></i>Info</a>
                </div>
              </div>
            </div>`;
            allPortElements.push(item);
        }
    }
    ;
    PortItemsInit();
    function appendPortItems(num) {
        let portfolioContainer = document.querySelector('.portfolio .portfolio-container');
        let allItemsCount = allPortElements.length;
        let currentItemsCount = document.querySelector('.portfolio .portfolio-container').childElementCount;
        for (let i = 0; i < num; i++) {
            let hiddenItemsCount = allItemsCount - currentItemsCount + i;
            if (hiddenItemsCount > 0) {
                portfolioContainer.append(allPortElements[currentItemsCount + i]);
            }
            if (document.querySelector('.portfolio .portfolio-container').childElementCount == allItemsCount) {
                document.getElementById('portfolio-load').style.display = 'none';
            }
        }
        // filtering and reinitializing lightBox
        filterPort();
    }
    appendPortItems(6);
    document.getElementById('portfolio-load').addEventListener('click', (e) => appendPortItems(3));
    function portfolioInit() {
        let portfoliocontainer = document.querySelector('.portfolio .portfolio-container');
        if (portfoliocontainer) {
            let portfolioFilters = document.querySelectorAll('#portfolio-filters li button');
            portfolioFilters.forEach((filter) => {
                filter.addEventListener('click', (e) => {
                    e.preventDefault();
                    let btn = e.target;
                    portfolioFilters.forEach((filter) => filter.classList.remove('active'));
                    btn.classList.add('active');
                    // filtering
                    filterPort();
                });
            });
        }
    }
    portfolioInit();
    // filtering function
    function filterPort() {
        let portfolioFilters = document.querySelectorAll('#portfolio-filters li button');
        let portfoliocontainer = document.querySelector('.portfolio .portfolio-container');
        let currentFilter;
        portfolioFilters.forEach((filter) => { filter.classList.contains('active') ? currentFilter = filter.getAttribute("data-filter") : ''; });
        Array.from(portfoliocontainer.children).forEach(child => {
            let currentChild = child;
            currentChild.classList.contains('show') ? '' : currentChild.classList.remove('show');
            currentChild.classList.contains('hidden') ? '' : currentChild.classList.add('hidden');
            Array.from(portfoliocontainer.querySelectorAll(currentFilter)).forEach(child => {
                let currentChild = child;
                currentChild.classList.remove('hidden');
                currentChild.classList.add('show');
            });
        });
        portLightBoxInit(`${currentFilter} .portfolio-lightbox`);
    }
    //
    // assigning lightbox
    function portLightBoxInit(selector = '.portfolio-lightbox') {
        console.log(selector);
        const portfolioLightbox = GLightbox({
            selector: selector
        });
    }
    /*
      reviews section swiber
    */
    new Swiper('.reviews-slider', {
        speed: 600,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false
        },
        slidesPerView: 'auto',
        pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true
        },
        breakpoints: {
            320: {
                slidesPerView: 1,
                spaceBetween: 40
            },
            480: {
                slidesPerView: 2,
                spaceBetween: 60
            },
            640: {
                slidesPerView: 2,
                spaceBetween: 80
            },
            992: {
                slidesPerView: 3,
                spaceBetween: 100
            },
            1200: {
                slidesPerView: 3,
                spaceBetween: 140
            }
        }
    });
    /*
      clients section swiber
    */
    new Swiper('.clients-slider', {
        speed: 400,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false
        },
        slidesPerView: 'auto',
        pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true
        },
        breakpoints: {
            320: {
                slidesPerView: 2,
                spaceBetween: 40
            },
            480: {
                slidesPerView: 3,
                spaceBetween: 60
            },
            640: {
                slidesPerView: 4,
                spaceBetween: 80
            },
            992: {
                slidesPerView: 6,
                spaceBetween: 120
            }
        }
    });
    /*
      initializing pure counter
    */
    new PureCounter({
        selector: '.purecounter',
        once: true,
        repeat: false,
    });
    /*
      events section
    */
    document.querySelector('.events .email-input .fa-arrow-right').addEventListener('click', arrow => document.querySelector('.events .email-input input').value = '');
    // countDown
    let countdownDate = new Date("Dec 22, 2023 15:37:25");
    let days = document.querySelector(".events .days span");
    let hours = document.querySelector(".events .hours span");
    let minutes = document.querySelector(".events .minutes span");
    let seconds = document.querySelector(".events .seconds span");
    let count = setInterval(() => {
        let now = new Date().getTime();
        let interval = countdownDate - now;
        Math.floor(interval / (1000 * 60 * 60 * 24)) < 10 ? days.innerHTML = '0' + Math.floor(interval / (1000 * 60 * 60 * 24)) : days.innerHTML = Math.floor(interval / (1000 * 60 * 60 * 24));
        Math.floor((interval % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) < 10 ? hours.innerHTML = '0' + Math.floor((interval % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) : hours.innerHTML = Math.floor((interval % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        Math.floor((interval % (1000 * 60 * 60)) / (1000 * 60)) < 10 ? minutes.innerHTML = '0' + Math.floor((interval % (1000 * 60 * 60)) / (1000 * 60)) : minutes.innerHTML = Math.floor((interval % (1000 * 60 * 60)) / (1000 * 60));
        Math.floor((interval % (1000 * 60)) / 1000) < 10 ? seconds.innerHTML = '0' + Math.floor((interval % (1000 * 60)) / 1000) : seconds.innerHTML = Math.floor((interval % (1000 * 60)) / 1000);
    }, 1000);
    /*
      contact section
    */
    document.getElementById('contactSend').addEventListener('click', (e) => {
        Array.from(document.querySelectorAll('.contact form input,.contact form textarea')).forEach((input) => input.value = '');
    });
    var options = {
        strings: ["Designers", "Creative", "Artists", "Elite^10000"],
        typeSpeed: 105,
        backSpeed: 100,
        loop: true,
        delay: 5000
    };
    var typed = new Typed('.auto-typed', options);
    // end of onload()
});
