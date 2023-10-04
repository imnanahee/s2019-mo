// 관리유형 안내
const createTipContent = `
    <span class=contClose><i class="fa-solid fa-xmark fa-xl"></i></span>
    <dl>
        <dt>방문관리란?</dt>
        <dd>
            방문관리 기간동안 코웨이 제품의 관리 전문가인 ‘코디’가 방문하여 제품별 서비스 점검시기에 방문관리 서비스를 제공합니다.
        </dd>
        <dt>자가관리란?</dt>
        <dd>
            자가관리 기간동안 제품별 필터 제공시기에 필터가 배송되면 고객님이 제품의 필터를 직접 교체하고 관리하실 수 있습니다. (일부 제품은 방문관리 전용)
        </dd>
    </dl>
`;

// 세자리마다 콤마 찍기
function commaCheck(e) {
    return e.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// 색상 코드 가져오기
function rgbToHex(rgb) {
    const values = rgb.match(/\d+/g);
    return `#${Number(values[0]).toString(16).padStart(2, '0')}${Number(values[1]).toString(16).padStart(2, '0')}${Number(values[2]).toString(16).padStart(2, '0')}`;
}

$(function() {
    var gnb_swiper = new Swiper('.gnb-swiper', {
        slidesPerView: 'auto',
        freeMode: true,
    });

    var gnb_swiper = new Swiper('.bestProduct-swiper', {
        slidesPerView: 'auto',
        freeMode: true,
        spaceBetween: 15,
    });

    // 클릭 시 메뉴 오픈
    $(document).on('click', '.menu-list img', function() {
       $('.menu-home').addClass('show');

       if ($('.menu-home').hasClass('show')) $('body').css('overflow-y', 'hidden');
    });

    // 버튼 클릭 시 메뉴 닫기
    $(document).on('click', '.tab-close', function() {
        setTimeout(() => {
            $('.menu-bottom div').removeClass('on');
            $('.menu-bottom .sub-menu').css('display', 'none');
            $('.menu-bottom .water').addClass('on');
            $('.water .sub-menu').css('display', 'block');
        }, 300);
        $('.menu-home').removeClass('show');
        $('body').css('overflow-y', '');
    });

    // 각 카테고리에 맞는 메뉴 열기
    $(document).on('click', '.menu-bottom div:not(.none) p', function() {
        var divElement = $(this).parent();
        var divSibling = divElement.siblings();
        divSibling.removeClass('on');
        divElement.addClass('on');
        $(this).siblings().css('display', 'block');
        divSibling.children('.sub-menu').css('display', 'none');
    });

    // header 벗어날 시 fixed 메뉴 노출
    $(window).on('scroll', function() {
        const header = $('#header');
        const fixedMenu = $('.fixed-menu');

        const scrollTop = $(window).scrollTop();
        const headerHeight = header.height();

        if (scrollTop >= headerHeight) {
            fixedMenu.addClass('fixed');
        } else {
            fixedMenu.removeClass('fixed');
        }
    });

    // nav 메뉴 클릭 시 해당되는 카테고리로 이동하는 공통 함수
    function navigateToCategory(index, category) {
        const cate = category[index];
        const subURL = `${window.location.pathname}#${encodeURIComponent(cate)}`;
        window.location.href = subURL;
        location.reload();
    }

    $('.menu-bottom > div').each(function(dlIndex, dl) {
        var ddList = $(dl).find('a:not(:first-child)');
        ddList.each(function(ddIndex, dd) {
            $(dd).on('click', function() {
                console.log(dlIndex); console.log(ddIndex);
                var categoryLists = [['tab2', 'tab3', 'tab4', 'tab5'], ['tab2', 'tab3', 'tab4'], ['tab2', 'tab3'], ['tab2', 'tab3']];
                var selectedCategories = categoryLists[dlIndex];
                navigateToCategory(ddIndex, selectedCategories);
            })
        })
    });
})
