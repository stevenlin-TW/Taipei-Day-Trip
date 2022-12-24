TPDirect.setupSDK(127002, 'app_9XZNjAvWS1qbk3xFFHKJxNABGNBlbQ91hrm06428zR98zZumHSScBfq4kFMK', 'sandbox');

let fields = {
    number: {
        element: '#card-number',
        placeholder: '**** **** **** ****'
    },
    expirationDate: {
        element: '#card-expiration-date',
        placeholder: 'MM / YY'
    },
    ccv: {
        element: '#card-ccv',
        placeholder: 'ccv'
    }
}

TPDirect.card.setup({
    fields: fields,
    styles: {
        // Style all elements
        'input': {
            'color': 'gray'
        },
        // Styling ccv field
        'input.ccv': {
            // 'font-size': '16px'
        },
        // Styling expiration-date field
        'input.expiration-date': {
            // 'font-size': '16px'
        },
        // Styling card-number field
        'input.card-number': {
            // 'font-size': '16px'
        },
        // style focus state
        ':focus': {
            // 'color': 'black'
        },
        // style valid state
        '.valid': {
            'color': 'green'
        },
        // style invalid state
        '.invalid': {
            'color': 'red'
        },
        // Media queries
        // Note that these apply to the iframe, not the root window.
        '@media screen and (max-width: 400px)': {
            'input': {
                'color': 'orange'
            }
        }
    },
    // 此設定會顯示卡號輸入正確後，會顯示前六後四碼信用卡卡號
    isMaskCreditCardNumber: true,
    maskCreditCardNumberRange: {
        beginIndex: 6,
        endIndex: 11
    }
})

function onSubmit(event) {
    event.preventDefault()
    
    let pay_btn = document.getElementById("pay_btn");
    pay_btn.disabled = true;
    pay_btn.textContent = "付款確認中...";
    

    // 取得 TapPay Fields 的 status
    const tappayStatus = TPDirect.card.getTappayFieldsStatus()

    // 確認是否可以 getPrime
    if (tappayStatus.canGetPrime === false) {
        alert('can not get prime')
        return
    }

    // Get prime
    TPDirect.card.getPrime((result) => {
        if (result.status !== 0) {
            alert('get prime error ' + result.msg)
            return
        }
        
        // send prime to your server, to pay with Pay by Prime API .
        // Pay By Prime Docs: https://docs.tappaysdk.com/tutorial/zh/back.html#pay-by-prime-api

        orderSchedule(result.card.prime);
    })
}


async function orderSchedule(card_prime){
    const booking_url = "/api/booking";
    let booking_response = await fetch(booking_url);
    let booking_data = await booking_response.json();

    const order_url = "/api/orders";
    let headers = {
        "Content-Type" : "application/json"
    };

    let contact_info = {
        "name" : document.getElementById("input_name").value,
        "email" : document.getElementById("input_email").value,
        "phone" : document.getElementById("input_phone").value
    }



    let order_info = {
        "price" : booking_data["data"]["price"],
        "trip" : {
            "attraction" : booking_data["data"]["attraction"],
            "date" : booking_data["data"]["date"],
            "time" : booking_data["data"]["time"]
        },
        "contact" : contact_info
    }

    let body = {
        "prime" : card_prime,
        "order" : order_info,
    }

    let order_response = await fetch(order_url, {
        method : "POST",
        headers : headers,
        body : JSON.stringify(body)
    })
    let order_data = await order_response.json();
    console.log(order_data);
    console.log(booking_data);
    if(order_data.data.payment.status == 0){
        location.href = "/thankyou?number=" + order_data.data.number.toString();
    } else {
        location.href = "/thankyou";
    }

}