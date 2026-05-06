import {groq} from 'next-sanity'

export const siteSettingsQuery = groq`
  *[_id == "siteSettings"][0]{
    brandName,
    logo{
      asset->{_id, url},
      alt
    },
    siteTitle,
    siteDescription,
    siteUrl,
    twitterHandle,
    ogImage{
      asset->{_id, url},
      alt
    }
  }
`

export const navbarQuery = groq`
  *[_type == "navbarSettings"][0]{
    homeLink{
      linkType,
      internalPage->{slug},
      externalUrl
    },
    navigationItems[]{
      _key,
      label,
      mainLink{
        linkType,
        internalPage->{slug},
        externalUrl
      },
      dropdownVariant,
      dropdownItems[]{
        _key,
        label,
        linkType,
        internalPage->{slug},
        externalUrl
      },
      featuredItem{
        label,
        linkType,
        internalPage->{slug},
        externalUrl
      }
    },
    actions[]{
      _key,
      label,
      linkType,
      internalPage->{slug},
      externalUrl,
      variant
    },
    mobileLinks[]{
      _key,
      label,
      linkType,
      internalPage->{slug},
      externalUrl
    }
  }
`

export const footerQuery = groq`
  *[_type == "footerSettings"][0]{
    columns[]{
      _key,
      title,
      links[]{
        _key,
        text,
        linkType,
        internalPage->{slug},
        externalUrl
      }
    },
    copyright,
    policies[]{
      _key,
      text,
      linkType,
      internalPage->{slug},
      externalUrl
    }
  }
`

export const pageBySlugQuery = groq`
  *[_type == "page" && slug.current == $slug][0]{
    _id,
    _type,
    title,
    "slug": slug.current,
    seoTitle,
    seoDescription,
    sections[]{
      _key,
      _type,
      eyebrow,
      title,
      body,
      primaryCtaLabel,
      primaryCtaHref,
      secondaryCtaLabel,
      secondaryCtaHref,
      paddingTop,
      paddingBottom,
      image{
        asset->{_id, url},
        alt
      },
      imageDark{
        asset->{_id, url},
        alt
      },
      description,
      link{
        linkType,
        internalPage->{slug},
        externalUrl
      },
      headerLayout,
      textAlign,
      layout,
      columns,
      gap,
      items[]{
        _key,
        _type,
        eyebrow,
        title,
        body,
        primaryCtaLabel,
        primaryCtaHref,
        secondaryCtaLabel,
        secondaryCtaHref,
        paddingTop,
        paddingBottom,
        image{
          asset->{_id, url},
          alt
        },
        imageDark{
          asset->{_id, url},
          alt
        },
        images[]{
          _key,
          title,
          description,
          image{
            asset->{_id, url},
            alt,
            hotspot,
            crop
          }
        },
        models[]{
          _key,
          title,
          description,
          thumbnail{
            asset->{_id, url},
            alt,
            hotspot,
            crop
          },
          file{
            asset->{_id, url},
            originalFilename,
            mimeType
          }
        },
        description,
        link{
          linkType,
          internalPage->{slug},
          externalUrl
        },
        headerLayout,
        textAlign,
        layout
      }
    }
  }
`
