$(document).ready(function () {
    $.getScript('js/product.js', function () {
        const products = window.products;

        // 베스트 상품 탭 관련 함수
        function productByTab(title) {
            const productCont = $('.product');
            if (productCont.length) {
                productCont.empty();
                const filter = products.filter(product => product.title.includes(title));
                const sliced = filter.slice(0, 4);

                $.each(sliced, function (index, product) {
                    const productElement = createProductElement(product);
                    productCont.append(productElement);
                });
            }
        }

        // 베스트 상품 엘리먼트 생성
        function createProductElement(product) {
            const divElement = $('<div></div>').addClass('cell');
            divElement.html(`
                <a href='detail.html?product_id=${product.id}'>
                    <img src="${product.imgSrc}">
                    <div class=productText>
                        <p class=desc>${product.subText}</p>
                        <h4 class=name>${product.alt}</h4>
                        <span class=code>${product.code}</span>
                    </div>
                </a>
            `);
            return divElement;
        }

        // 서브 베스트 메뉴 관련 함수
        function bestProducts(state, title) {
            const productList = $('.best-product .product-list');
            productList.empty();

            const filteredProducts = products.filter(product =>
                product.state.includes('BEST') && product.title === title);

            $.each(filteredProducts, function (index, product) {
                const productElement = createSubBestProduct(product);
                productList.append(productElement);
            });
        }

        // 서브 베스트 메뉴 엘리먼트 생성
        function createSubBestProduct(product) {
            const divElement = $('<div></div>').addClass('cell swiper-slide');
            const state = product.state.map((item, index) =>
                `<strong>${index ? ' · ' : ''}&nbsp;${item}&nbsp;</strong>`
            ).join('');
            divElement.html(`
                <a href='detail.html?product_id=${product.id}'>
                    <div class=state>${state}</div>
                    <img src="${product.imgSrc}">
                    <div class=productText>
                        <p class=desc>${product.subText}</p>
                        <h4 class=name>${product.alt}</h4>
                        <ul class=priceWrap>
                            <li>
                                <p>구매</p>
                                <span class=price>${commaCheck(product.price)}원~</span>
                            </li>
                            <li>
                                <p>렌탈</p>
                                <span class=rentalPrice>월 ${commaCheck(product.rentalPrice)}원~</span>
                            </li>
                        </ul>
                    </div>
                </a>
            `);
            return divElement;
        }

        // 서브 - 상품 전체 리스트 관련 함수
        function displayProducts(category) {
            const allProductList = $('.all-product .product-list');
            allProductList.empty();

            const filteredProducts = products.filter(product => product.category === category);

            $.each(filteredProducts, function (index, product) {
                const productElement = createItemElement(product);
                allProductList.append(productElement);
            });
        }

        // 모든 상품 리스트 관련 함수
        function displayAllProducts(category) {
            const allProductList = $('.all-product .product-list');
            allProductList.empty();

            const filteredProducts = products.filter(product => product.title === category);

            $.each(filteredProducts, function (index, product) {
                const productElement = createItemElement(product);
                allProductList.append(productElement);
            });
        }

        // 모든 상품 엘리먼트 생성
        function createItemElement(product) {
            const divElement = $('<div></div>').addClass('cell');
            const state = product.state.map((item, index) =>
                `<strong>${index ? ' · ' : ''}&nbsp;${item}&nbsp;</strong>`
            ).join('');
            divElement.html(`
                <a href='detail.html?product_id=${product.id}'>
                    <div class=state>${state}</div>
                    <img src="${product.imgSrc}">
                    <div class=productText>
                        <span class=category>${product.category}</span>
                        <p class=desc>${product.subText}</p>
                        <h4 class=name>${product.alt}</h4>
                        <ul class=priceWrap>
                            <li>
                                <p>구매</p>
                                <span class=price>${commaCheck(product.price)}원~</span>
                            </li>
                            <li>
                                <p>렌탈</p>
                                <span class=rentalPrice>월 ${commaCheck(product.rentalPrice)}원~</span>
                            </li>
                        </ul>
                    </div>
                </a>
            `);
            return divElement;
        }

        // 베스트 상품 탭 메뉴 관련
        const tabButtons = $('.category-menu li');
        tabButtons.on('click', function () {
            $('.category-menu li').removeClass('on');
            $(this).addClass('on');

            const title = $(this).children('p').text();
            productByTab(title);

            const tabId = $(this).attr('id');
            $('.product').removeClass().addClass(`product ${tabId}`);
        });

        // 모든 카테고리 버튼 클릭 시
        $('.category-item button').on('click', function () {
            const selectedCategory = $(this).text();

            if (selectedCategory === '전체') {
                if ($('body').hasClass('water-page')) {
                    displayAllProducts('정수기');
                } else if ($('body').hasClass('air-page')) {
                    displayAllProducts('청정기');
                } else if ($('body').hasClass('body-page')) {
                    displayAllProducts('비데/연수기');
                } else if ($('body').hasClass('sleep-page')) {
                    displayAllProducts('매트리스/프레임');
                }
            } else {
                displayProducts(selectedCategory);
            }

            $('.category-item button').removeClass('on');
            $(this).addClass('on');
        });
        
        // displayProducts(), categoryBtn() 모듈화
        function handleTab(tabId, categoryName) {
            $('.category-item button').removeClass('on'); // 모든 버튼의 'on' 클래스 제거
            $(`#${tabId}`).addClass('on'); // 클릭한 버튼에 'on' 클래스 추가
            displayProducts(categoryName);
        }

        // 링크 hash값 가져와 메뉴 이동
        const hash = window.location.hash;
        if ($('body').hasClass('index-page')) {
            productByTab(tabButtons.first().children('p').text());

        } else if ($('body').hasClass('water-page')) { // 정수기 페이지
            bestProducts('BEST', '정수기');
            displayAllProducts('정수기');
            
            if (hash.includes('tab2')) {
                handleTab('tab2', '냉정수기');
            } else if (hash.includes('tab3')) {
                handleTab('tab3', '얼음정수기');
            } else if (hash.includes('tab4')) {
                handleTab('tab4', '냉온정수기');
            } else if (hash.includes('tab5')) {
                handleTab('tab5', '정수전용');
            }
            
        } else if ($('body').hasClass('air-page')) { // 청정기 페이지
            bestProducts('BEST', '청정기');
            displayAllProducts('청정기');

            $('.menu-bottom > div').removeClass('on');
            $('.menu-bottom .sub-menu').css('display', 'none');

            $('.menu-bottom .air').addClass('on');
            $('.air .sub-menu').css('display', 'block');

            if (hash.includes('tab2')) {
                handleTab('tab2', '공기청정기');
            } else if (hash.includes('tab3')) {
                handleTab('tab3', '가습기');
            } else if (hash.includes('tab4')) {
                handleTab('tab4', '의류청정기');
            }

        } else if ($('body').hasClass('body-page')) { // 비데 페이지
            bestProducts('BEST', '비데/연수기');
            displayAllProducts('비데/연수기');

            $('.menu-bottom > div').removeClass('on');
            $('.menu-bottom .sub-menu').css('display', 'none');

            $('.menu-bottom .body').addClass('on');
            $('.body .sub-menu').css('display', 'block');

            if (hash.includes('tab2')) {
                handleTab('tab2', '비데');
            } else if (hash.includes('tab3')) {
                handleTab('tab3', '연수기');
            }

        } else if ($('body').hasClass('sleep-page')) { // 매트리스 페이지
            bestProducts('BEST', '매트리스/프레임');
            displayAllProducts('매트리스/프레임');

            $('.menu-bottom > div').removeClass('on');
            $('.menu-bottom .sub-menu').css('display', 'none');

            $('.menu-bottom .sleep').addClass('on');
            $('.sleep .sub-menu').css('display', 'block');

            if (hash.includes('tab2')) {
                handleTab('tab2', '매트리스');
            } else if (hash.includes('tab3')) {
                handleTab('tab3', '프레임');
            }
        }

        // 서브 비주얼 배너 Swiper
        var swiper = new Swiper(".sub-swiper", {
            effect: 'fade',
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            loop: true,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            }
        });
    });
});