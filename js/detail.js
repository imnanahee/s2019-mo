$(document).ready(function () {
    // URL 매개변수를 추출하는 함수 추가
    $.urlParam = function(name){
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (results == null) return null;
        else return decodeURI(results[1]) || 0;
    }

    $.getScript('js/product.js', function () {
        const detailView = $('.detail-view .inner');

        // 상품 디테일 페이지
        const fetchProductDetails = (productId) => {
            const productItem = products.find((item) => item.id === productId);
            return productItem;
        }

        // URL에서 상품 id 추출
        const productId = parseInt($.urlParam('product_id'));
        const product = fetchProductDetails(productId);

        // 상품 상세 정보 
        function createProductElement(product) {
            const divElement = $('<div></div>').addClass('cell');
            const state = product.state.map((item, index) =>
                `<strong>${index ? ' · ' : ''}&nbsp;${item}&nbsp;</strong>`
            ).join('');
            divElement.html(`
                <div class=infoTop>
                    <div class=state>${state}</div>
                    <h4 class=name>${product.alt}<span class=code> &#40;${product.code}&#41;</span></h4>
                    <p class=desc>${product.subText}</p>
                    <img src="${product.imgSrc}">
                    <span class=category>${product.category}</span>
                </div>
                <div class=infoBottom>
                    ${product.title === '매트리스/프레임' ?
                        `<div class=mattress>
                            <div class=inBox>
                                <h5>사이즈</h5>
                                <p class=areas>
                                    ${product.size.map(size => `
                                        <span>${size}</span>
                                    `).join('')}
                                </p>
                            </div>
                            ${product.hardness.length > 0 ? `
                                <div class=inBox>
                                    <h5>경도</h5>
                                    <p class=areas>
                                        ${product.hardness.map(hard => `
                                            ${product.hardness.length >= 2 ? `
                                                <span>${hard}</span>
                                            `: `<span class=area>${hard}</span>`}
                                        `).join('')}
                                    </p>
                                </div>
                            ` : ``}
                        </div>
                    `: ``}
                    ${product.colors.length > 0 ? `
                        <div class=colorWrap>
                            <ul class=colorType>
                                ${product.colors.map(colorInfo => `
                                    <li 
                                        style="background:${colorInfo.colorCode}"
                                        ${colorInfo.colorClass ? `class="${colorInfo.colorClass}"` : ''}
                                        >
                                            <span>${colorInfo.color}</span>
                                    </li>
                                `).join('')}
                            </ul>
                            <div class=colorList>
                                ${product.colors.map(colorInfo => `
                                    <p>${colorInfo.color}</p>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                <div class=tabMenuWrap>
                    <ul class=tabMenu>
                        <li class="on" data-tab="buyType1">렌탈</li>
                        <li data-tab=buyType2>구매</li>
                    </ul>
                    <div id=buyType1 class="tab on">
                        <div class=boxWrap>
                            <div class=inBox>
                                <h5>관리유형 <span class="toolTip fa-solid fa-circle-question"></span></h5>
                                ${product.manageType.length > 1 ? `
                                    <p class=areas>
                                    ${product.manageType.map(manageType => `
                                        <span>${manageType}</span>
                                    `).join('')}
                                    </p>
                                ` :
                                    `${product.manageType.map(manageType => `
                                            <p class=area>${manageType}</p>
                                    `).join('')}
                                `}
                            </div>
                            <div class="inBox last">
                                <h5>약정기간</h5>
                                <p class=box>
                                    ${product.contract.map((contract, index) => `
                                        <span class=contract${index}>${contract.period}</span>
                                    `).join('')}
                                </p>
                            </div>
                        </div>
                        <div class=totalPrice>
                            <h5>예상 렌탈료</h5>
                            <div class=priceWrap>
                                ${product.contract.map((contract, index) => {
                                    if (contract.price !== "") {
                                        return `
                                            <div class="contract${index}">
                                                <span>${contract.period}</span>
                                                <p class="price">월 ${commaCheck(contract.price)}원</p>
                                                <p class="salePrice">월 <strong>${commaCheck(contract.salePrice)}</strong>원</p>
                                            </div>
                                        `;
                                    } else {
                                        return `
                                            <div class="contract${index}">
                                                <span>${contract.period}</span>
                                                <p class="salePrice">월 <strong>${commaCheck(contract.salePrice)}</strong>원</p>
                                            </div>
                                        `;
                                    }
                                }).join('')}
                            </div>
                        </div>
                    </div>
                    <div id=buyType2 class=tab>
                        <div class=boxWrap>
                            <div class=inBox>
                                <h5>관리유형 <span class="toolTip fa-solid fa-circle-question"></span></h5>
                                ${product.manageType.length > 1 ? `
                                    <p class=areas>
                                    ${product.manageType.map(manageType => `
                                        <span>${manageType}</span>
                                    `).join('')}
                                    </p>
                                ` :
                                `${product.manageType.map(manageType => `
                                        <p class=area>${manageType}</p>
                                    `).join('')}
                                `}
                            </div>
                            ${product.component.length > 0 ? `
                                <div class="inBox last">
                                    <h5>추가구성품</h5>
                                    <div class=componentSelect>
                                        <button type="button" class="noSelected"><span>선택안함</span><i class="fa-solid fa-caret-down"></i></button>
                                        <ul class=componentList>
                                            ${product.component.map(component => `
                                                <li>${component}</li>
                                            `).join('')}
                                        </ul>
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                        <div class=totalPrice>
                            <h5>예상 구매가</h5>
                            <p class="purchase"><strong>${commaCheck(product.price)}</strong>원</p>
                        </div>
                    </div>
                </div>
            </div>
            `);
            return divElement;
        }


        // 약정 버튼 클릭 시 그에 맞는 렌탈가 노출
        function contractBtnGetClass() {
            const contractPrice = $('.priceWrap div');

            $('.box .contract0').addClass('on');
            $('.priceWrap .contract0').addClass('on');

            $('.box span').click(function() {
                const getBtnClass = $(this).attr('class'); // span의 class값 가져오기
                const matchingDiv = contractPrice.filter('.' + getBtnClass); // span과 class값이 같은 div 가져오기
                
                $('.box span').removeClass('on');
                $(this).addClass('on');
                
                contractPrice.removeClass('on');
                matchingDiv.addClass('on');
            });
        }

        // 구매, 렌탈 탭메뉴
        function openTab(tabId) {
            $('.tab').removeClass('on');
            $('#' + tabId).addClass('on');
        }


        // 상품 상세 정보 불러오기
        if (product) {
            detailView.append(createProductElement(product));
        } else {
            alert('상품을 찾을 수 없습니다.');
            location.href = 'index.html';
        }


        // 상품 컬러 선택 시 이벤트 리스너 추가
        const colorTypeLi = $('.colorType li');
        const li = $('.colorType li:first-child');
        if (colorTypeLi.length !== 1) {
            li.addClass('on');
            colorTypeLi.on('click', function() {
                $('.colorType li').removeClass('on');
                $(this).addClass('on');

                const selectedColorCode = $(this).css('background-color');
                const selectedColorCodeHex = rgbToHex(selectedColorCode);
                const selectedColor = product.colors.find(colorInfo => colorInfo.colorCode === selectedColorCodeHex);
    
                if (selectedColor) {
                    $('.colorList p').css('display', 'none');
    
                    // 선택된 색상과 일치하는 p.colorList만 보이게 설정
                    $('.colorList p').each(function() {
                        const colorText = $(this).text().trim();
                        if (colorText === selectedColor.color) {
                            $(this).css('display', 'block');
                        }
                    })
                }
            })

        } else {
            li.addClass('on');
        }


        // 구매, 렌탈 탭메뉴
        $('.tabMenu li').on('click', function() {
            const tabId = $(this).attr('data-tab');

            $('.tabMenu li').removeClass('on')
            $(this).addClass('on');

            openTab(tabId);
        })


        // 관리유형 옵션 on off
        $('.tab').each(function() {
            const areaSpan = $(this).find('.areas span');

            // 매트리스 상품일 경우 - 관리유형
            if (areaSpan.length > 0) areaSpan.first().addClass('on');

            areaSpan.on('click', function() {
                $(this).siblings().removeClass('on');
                $(this).addClass('on');
            });
        })


        // 매트리스 상품일 경우 - 사이즈, 경도 옵션 on off
        $('.mattress .inBox').each(function() {
            const areasInSpan = $(this).find('.areas span');

            if (areasInSpan.length > 0) {
                areasInSpan.first().addClass('on');
            }

            areasInSpan.on('click', function() {
                $(this).siblings().removeClass('on');
                $(this).addClass('on');
            })
        })


        // 관리유형 안내
        $('.toolTip').on('click', function() {
            const tipContent = $('<div>').addClass('tipContent').html(createTipContent);
            $('.tab.on .inBox:not(.last)').append(tipContent);

            // toolTip 닫기
            $('.contClose').on('click', function() {
                tipContent.remove()
            })

            // toolTip외 body 클릭 시 닫기
            $(document.body).on('click', function(e) {
                var target = $(e.target);
                if (
                    target.hasClass('tipContent') ||
                    target.hasClass('contClose') ||
                    target.hasClass('toolTip')
                ) {
                    return;
                }
    
                tipContent.remove();
            })
        });


        // 추가구성품
        const component = $('.componentSelect');
        if (component.length) {
            component.on('click', function() {
                $(this).children('.componentList').addClass('active');
            })

            $('.componentList li').on('click', function(e) {
                e.stopImmediatePropagation();
                const liTextContent = $(this).text();
                const noSelected = $('.componentSelect button span');
                component.children('.componentList').removeClass('active');
                noSelected.text(liTextContent);

                if (noSelected.text() !== '선택안함') {
                    noSelected.parent().removeClass('noSelected').addClass('selected');
                } else {
                    noSelected.parent().addClass('noSelected').removeClass('selected');
                }
            })
        }

        contractBtnGetClass();
        
    });
});