#!/usr/bin/python
# -*- coding: utf-8 -*-

import sys
import numpy as np
from wordcloud import WordCloud
from arabic_reshaper import ArabicReshaper
from bidi.algorithm import get_display
from PIL import Image
import matplotlib.pyplot as plt
import urllib, base64
import io



def ar_text(txt):
    configuration = {
        'delete_harakat': False,
        'support_ligatures': True,
        'RIAL SIGN': True,  # Replace ر ي ا ل with ﷼
        'use_unshaped_instead_of_isolated': True
    }
    reshaper = ArabicReshaper(configuration=configuration)
    reshaped_text = reshaper.reshape(txt)    # correct its shape
    return get_display(reshaped_text)

def ar_txt_array(arr):
    for i in range(len(arr)):
        arr[i] = ar_text(arr[i])
    return arr

# Helper function to create a mask to wordscloud
def transform_format(val):
    if val == 0:
        return 255
    else:
        return val


def page13():
    data = sys.argv[1]
    import re
    temp = re.sub(r"\],\[", " ", data)
    temp = re.sub(r"\[*\]*", "", temp)
    arr = temp.split(' ')

    myData = {}
    for i in arr:
        line = i.split(',')
        myData[line[0]] = int(line[1])


    # Image Mask to shape the wordcloud
    img_mask = np.array(Image.open("/usr/src/app/public/images/img_mask.png"))
    transformed_img_mask = np.ndarray(
        (img_mask.shape[0], img_mask.shape[1]), np.int32)
    for i in range(len(img_mask)):
        transformed_img_mask[i] = list(map(transform_format, img_mask[i]))

    wc = WordCloud(
        font_path="/usr/src/app/public/fonts/almari/Almarai-Regular.ttf",
                    background_color="rgba(250, 252, 253, 0)", mode="RGBA",
                    max_words=9999, width=1000, height=1000,
                    mask=transformed_img_mask, contour_width=0,
                    contour_color='firebrick'
                    )

    d = {}

    for key, value in myData.items():
        d[ar_text(key)] = value


    wc.generate_from_frequencies(frequencies=d)
    plt.imshow(wc, interpolation='bilinear')
    plt.axis("off")

    image = io.BytesIO()
    plt.savefig(image, format='png')
    image.seek(0)  # rewind the data
    string = base64.b64encode(image.read())

    image_64 = 'data:image/png;base64,' + urllib.parse.quote(string)
    print(image_64)

page13()