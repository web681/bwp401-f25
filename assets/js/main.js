// قراءة اختيارات الصفحة من الرابط.
function queryValue(name) {
    var parts = window.location.search.substring(1).split('&');
    for (var i = 0; i < parts.length; i++) {
        var pair = parts[i].split('=');
        if (pair[0] === name) {
            try { return decodeURIComponent((pair[1] || '').replace(/\+/g, ' ')); }
            catch (error) { return ''; }
        }
    }
    return '';
}

// فلترة البطاقات بالعنوان والتصنيف والتاريخ والمكان.
var filters = document.getElementById('filters');
if (filters) {
    var search = document.getElementById('search');
    var category = document.getElementById('category');
    var date = document.getElementById('date');
    var place = document.getElementById('location');
    var initialCategory = queryValue('category');
    for (var c = 0; c < category.options.length; c++) {
        if (category.options[c].value === initialCategory) { category.value = initialCategory; }
    }
    function filterEvents() {
        var cards = document.querySelectorAll('.event-card');
        var count = 0;
        for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            var show = card.getAttribute('data-title').indexOf(search.value.trim()) !== -1 &&
                (!category.value || card.getAttribute('data-category') === category.value) &&
                (!date.value || card.getAttribute('data-date') === date.value) &&
                (!place.value || card.getAttribute('data-location') === place.value);
            card.hidden = !show;
            if (show) { count++; }
        }
        document.getElementById('empty').hidden = count !== 0;
    }
    filters.addEventListener('input', filterEvents);
    filters.addEventListener('change', filterEvents);
    filters.addEventListener('submit', function (event) { event.preventDefault(); });
    filters.addEventListener('reset', function () { setTimeout(filterEvents, 0); });
    filterEvents();
}

// إظهار تفاصيل الفعالية المطلوبة، أو الفعالية الأولى للرابط العام.
var detail = document.getElementById('detail-' + queryValue('id'));
if (detail) {
    var details = document.querySelectorAll('.event-details');
    for (var d = 0; d < details.length; d++) { details[d].hidden = true; }
    detail.hidden = false;
}
var shareButtons = document.querySelectorAll('.share-button');
for (var s = 0; s < shareButtons.length; s++) {
    shareButtons[s].addEventListener('click', function () {
        document.getElementById('shareLink').value = window.location.href.split('?')[0].split('#')[0] + '?id=' + this.getAttribute('data-event');
    });
}
var shareLink = document.getElementById('shareLink');
if (shareLink) { shareLink.addEventListener('click', function () { this.select(); }); }

// التحقق من الحقول دون إرسال البيانات إلى خادم.
var form = document.getElementById('contactForm');
if (form) {
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        var name = document.getElementById('name');
        var email = document.getElementById('email');
        var message = document.getElementById('message');
        var valid = name.value.trim() && message.value.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
        var alertBox = document.getElementById('formAlert');
        alertBox.hidden = false;
        alertBox.className = valid ? 'alert alert-success mt-3' : 'alert alert-danger mt-3';
        alertBox.textContent = valid ? 'البيانات صحيحة. هذا نموذج تدريبي ولم يتم إرسال الرسالة.' : 'يرجى إدخال الاسم والرسالة وبريد إلكتروني صحيح.';
    });
}
