export const question = {
    question: `<p><img src="https://minimal-assets-api.vercel.app/assets/images/avatars/avatar_5.jpg" />Ba điện t&iacute;ch <em>điểm bằng nhau</em> <b>đặt</b> trong ch&acirc;n kh&ocirc;ng c&aacute;ch nhau một khoảng <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>r</mi><mo>=</mo><mn>2</mn><mo stretchy="false">(</mo><mi>c</mi><mi>m</mi><mo stretchy="false">)</mo></math>. Lực đẩy giữa ch&uacute;ng l&agrave; <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>F</mi><mo>&#160;</mo><mo>=</mo><mo>&#160;</mo><mn>1</mn><mo>,</mo><mn>6</mn><mo>.</mo><msup><mn>10</mn><mrow><mo>-</mo><mn>4</mn></mrow></msup><mo>&#160;</mo><mo>(</mo><mi>N</mi><mo>)</mo></math>. Độ lớn của hai điện t&iacute;ch đ&oacute; l&agrave;:</p>`,
    choices: [
        {
            content: `<math xmlns="http://www.w3.org/1998/Math/MathML"><msub><mi>q</mi><mn>1</mn></msub><mo>=</mo><msub><mi>q</mi><mn>2</mn></msub><mo>=</mo><mn>2</mn><mo>,</mo><mn>67</mn><mo>.</mo><msup><mn>10</mn><mrow><mo>-</mo><mn>9</mn></mrow></msup><mo>(</mo><mi>&#956;</mi><mi>C</mi><mo>)</mo></math>`,
            isTrue: false
        },
        {
            content: `<math xmlns="http://www.w3.org/1998/Math/MathML"><msub><mi>q</mi><mn>1</mn></msub><mo>=</mo><msub><mi>q</mi><mn>2</mn></msub><mo>=</mo><mn>2</mn><mo>,</mo><mn>67</mn><mo>.</mo><msup><mn>10</mn><mrow><mo>-</mo><mn>9</mn></mrow></msup><mo>(</mo><mi>&#956;</mi><mi>C</mi><mo>)</mo></math>`,
            isTrue: false
        },
        {
            content: `<math xmlns="http://www.w3.org/1998/Math/MathML"><msub><mi>q</mi><mn>1</mn></msub><mo>=</mo><msub><mi>q</mi><mn>2</mn></msub><mo>=</mo><mn>2</mn><mo>,</mo><mn>67</mn><mo>.</mo><msup><mn>10</mn><mrow><mo>-</mo><mn>9</mn></mrow></msup><mo>(</mo><mi>&#956;</mi><mi>C</mi><mo>)</mo></math>`,
            isTrue: false
        },
        {
            content: `<math xmlns="http://www.w3.org/1998/Math/MathML"><msub><mi>q</mi><mn>1</mn></msub><mo>=</mo><msub><mi>q</mi><mn>2</mn></msub><mo>=</mo><mn>2</mn><mo>,</mo><mn>67</mn><mo>.</mo><msup><mn>10</mn><mrow><mo>-</mo><mn>9</mn></mrow></msup><mo>(</mo><mi>&#956;</mi><mi>C</mi><mo>)</mo></math>`,
            isTrue: true
        }
    ]
}

export const question2 = {
    question: "<b>Cho mạch điện như hình vẽ</b><img src='https://minimal-assets-api.vercel.app/assets/images/avatars/avatar_5.jpg' />: Mỗi nguồn có $\\xi  = 4,5$V, Bình điện phân đựng dung dịch${\\rm{\\;CuS}}{{\\rm{O}}_4}/{\\rm{Cu}}$. Cho biết A = 64, n = 2.",
    choices: [
        {
            content: 'AAAA',
            isTrue: true
        },
        {
            content: 'AAAA',
            isTrue: true
        },
        {
            content: 'AAAA',
            isTrue: true
        },
        {
            content: 'AAAA',
            isTrue: true
        },

    ]
}

export const questions = [...Array(5)].map((_, i) => ({id: i, ...question2}))