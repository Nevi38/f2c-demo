const creationTime = [
  {
    $addFields: {
      currentTime: {
        $toDate: {
          $dateToString: {
            format: '%Y-%m-%d %H:%M:%S',
            date: '$$NOW'
          }
        }
      }
    }
  },
  {
    $addFields: {
      timeDifference: {
        $divide: [
          {
            $subtract: [
              '$currentTime',
              '$creationTime'
            ]
          },
          60000
        ]
      }
    }
  },
  {
    $addFields: {
      timeDifferenceFormatted: {
        $switch: {
          branches: [
            {
              case: {
                $gte: ['$timeDifference', 1440]
              },
              then: {
                $concat: [
                  {
                    $toString: {
                      $divide: [
                        '$timeDifference',
                        1440
                      ]
                    }
                  },
                  ' days'
                ]
              }
            },
            {
              case: {
                $gte: ['$timeDifference', 60]
              },
              then: {
                $concat: [
                  {
                    $toString: {
                      $divide: [
                        '$timeDifference',
                        60
                      ]
                    }
                  },
                  ' hours'
                ]
              }
            }
          ],
          default: {
            $concat: [
              { $toString: '$timeDifference' },
              ' minutes'
            ]
          }
        }
      }
    }
  },
  {
    $project: {
      currentTime: 0,
      timeDifference: 0
    }
  },
  {
    $out: 'Post' // Ghi đè lên bộ sưu tập "Post" ban đầu
  }
]

export default creationTime